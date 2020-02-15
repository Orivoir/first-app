const SocketCommand = {

    idOutput: null ,

    init( socket , command ) {

        this.cmd = command ;
        this.worker = socket ;

        this.attachListeners() ;
    } ,

    attachListeners() {

        this
            .cd()
        ;

    } ,

    cd() {

        const socket = this.worker ;

        socket.on('cd error' , path => {

            const outputElement = document.querySelector(`#${this.idOutput}`) ;

            outputElement.textContent = `"${path}" , not exists` ;

            this.cmd.isPendingAction = false ;

        } ) ;

        socket.on('cd success' , path => {

            this.cmd.isPendingAction = false ;

            const outputElement = document.querySelector(`#${this.idOutput}`) ;

            Terminal.cwd = path ;
            outputElement.textContent = `"${path}" , is the new current work directory` ;
        } ) ;

        return this ;
    }

} ;

const Vars = {

    state: [
        {
            key: "$HOST" ,
            val: "127.0.0.1" ,
            writable: false ,
        } , {

            key: "$AUTHOR" ,
            val: "Orivoir21" ,
            writable: false ,
        }
    ] ,

    get notWritable() {

        return this.state.filter( _var => _var.writable === false ) ;

    } ,

    setState() {

        // for output
        this.upgradesVar = [] ;

        // upgrade var already exists
        this.state = this.state.map( _var => {

            const newVar = this.isRedefine( _var.key ) ;

            if( !!newVar ) {
                _var.val = newVar.val ;
                _var.writable = newVar.writable ;
                this.upgradesVar.push( newVar ) ;
            }

            return _var ;

        } ) ;

        // for output
        this.createsVar = [] ;

        // add new vars
        this.varsNormalized.forEach( vNormalized => {

            if( !this.alreadyExists(vNormalized.key) ) {

                this.createsVar.push( vNormalized ) ;
                this.state.push( vNormalized ) ;
            }

        } ) ;
    } ,

    alreadyExists( key ) {

        return !!this.state.find( _var => _var.key === key ) ;

    } ,

    isRedefine( key ) {

        return this.varsNormalized.find( _v => _v.key === key ) ;

    } ,

    isProtect( key ) {

        const {notWritable} = this ;

        return !!notWritable.find( _var => _var.key === key ) ;

    } ,

    checkNotAuthorizeAffect() {

        this.rejectsAffect = [] ;

        this.varsNormalized = this.varsNormalized.filter( varNormalized => {

            if( this.isProtect( varNormalized.key )  ) {

                this.rejectsAffect.push( varNormalized ) ;
                return false ;
            }

            return true ;
        } ) ;

    } ,

    normalize( varParsed ) {

        varParsed = varParsed
        .map( vParse => {

            const save = {
                key: vParse[0]
            } ;

            let [val,writable] = vParse[1].split('|') ;

            writable = !/(read(only)?|r(d)?o(n)?(l)?(y)?)/i.test(writable) ;

            save.val = val ;
            save.writable = writable ;

            return save ;
        } ) ;

        this.varsNormalized = varParsed ;

        this.checkNotAuthorizeAffect() ;
        this.setState() ;
    } ,

    parse( varstr  ) {

        varstr = varstr
            .trim()
            .split(';')
            .map( _var => (
                _var
                    .trim()
                    .split('=')
                    .map( key => (
                        key.trim()
                    ) )
            ) )
            .filter( _var => _var.length === 2 ) // exlude last ";" char
        ;

        this.normalize( varstr ) ;

        return this ;
    }

} ;

class Command {

    static get PATTERN_ARG_FUNC() {

        return /^[a-z]{1,50}\([ ]{0,}\)$/i ;
    }

    static get PATTERN_ARG_GLOBAL() {

        return /^(\-)(\-)/ ;
    }

    static get PATTERN_VAR() {

        return /^\$[a-z\_]{1}[a-z\_\d]{0,254}[ ]{0,}\=[ ]{0,}.{1,}/i ;
    }

    get isVar() {

        return Command.PATTERN_VAR.test( this.commandString ) ;
    }

    constructor({
        terminal ,
        commandString
    }) {

        if( !SocketCommand.worker ) {

            // listeners TCP/IP commands inner an litteral object
            // for not dupplicate listeners between instance of Command object
            SocketCommand.init( terminal.socket , this ) ;
        }

        this.terminal = terminal ;

        this.commandString = commandString ;

        this.nextLine() ;

        this.explodeCommand() ;

        if( this.isValidCommandName ) {

            // ...
            console.log( "valid command name" );

            const cmd = this.getCmdByName( this.commandName ) ;

            if( this[ cmd.normalize ] instanceof Function  ) {

                if( cmd.argsRequireLength > this.argsCmd ) {

                    this.output = `"${this.commandName}" , have ${cmd.argsRequireLength} args require` ;

                } else {

                    this[ cmd.normalize ]() ;
                }

            } else {

                this.output = `"${this.commandName}" , is valid command name but action in dev` ;
            }

        }  else if( this.isVar ) {

            Vars.parse( this.commandString , this ) ;

            this.output = `${Vars.rejectsAffect.length} vars not write access, ${Vars.createsVar.length} vars has been created, ${Vars.upgradesVar.length} vars has been set` ;

        } else if( !this.isOnlyArgs ) {

            this.output = `"${this.commandName}" , is not an valid command name` ;
        } else {

            if( this.isClearHistory ) {

                this.output = `history commands has been removed` ;
            }

            // ...
            console.log( "only args" );
        }

        if( this.output ) {
            document.querySelector(`#${this.idOutput}`).textContent = this.output ;
        }

    }

    echo() {

        const print = this.argsCmd.join(' ') ;

        const outputElement = document.querySelector(`#${this.idOutput}`) ;

        outputElement.textContent = `"${print}"` ;
    }

    cd() {

        const path = this.argsCmd[0] ;

        this.isPendingAction = true ;

        const {socket} = this.terminal ;

        SocketCommand.idOutput = this.idOutput ;

        socket.emit('cd' , {
            pathCd:path ,
            cwd: this.terminal.cwd
        } ) ;

    }

    getCmdByName( cmdName ) {

        return Command.cmdsList.find( cmd => (
            cmd.pattern.test( cmdName )
        ) ) ;
    }

    nextLine() {

        this.idOutput = new NextLineTerminal( {

            cwd: this.terminal.cwd ,
            commandString: this.commandString ,
            terminalList: this.terminal.list

        } ).idOutput ;

        return this ;
    }

    get isLogout() {

        return !![ ...this.argsGlobal , ...this.argsFunc ].find( arg => (
            /(logout|exit|quit)/.test( arg )
        ) )  || /(logout|exit|quit)/.test(this.commandName)  ;
    }

    get isClearView() {

        return !!this.argsFunc.find( arg => (
            /clear\([ ]{0,}\)/.test( arg.trim() )
        ) ) ;

    }

    get isClearHistory() {

        return (
            !!this.argsGlobal.find( arg => (
                /clear$/.test( arg )
            ) )
        ) ;

    }

    get isPendingAction() {
        return this._isPendingAction;
    }
    set isPendingAction( isPendingAction ) {

        this._isPendingAction = !!isPendingAction ;

        if( this._isPendingAction ) {

            // stop layout
            console.log('action in load ...');
        } else {
            console.log('finish load action with : ' + this.commandName );
            // start layout
        }
    }

    static get cmdsList() {

        return commandsList ;
    }

    get isValidCommandName() {

        return !!this.getCmdByName( this.commandName ) ;
    }

    get isOnlyArgs() {

        return Command.PATTERN_ARG_FUNC.test( this.commandName ) || Command.PATTERN_ARG_GLOBAL.test( this.commandName ) ;
    }

    get commandString() {
        return this._commandString;
    }
    set commandString(commandString) {

        this._commandString = ( typeof commandString === 'string' ) ? commandString : null;

        if( !this._commandString ) {

            throw "[ConstructorError] commandString must be an string type" ;
        }
    }

    explodeCommand() {

        // "abc def -truc" <=> ['abc','def','-truc']
        const elementsCmds = this.commandString
            .trim()
            .split(' ')
            .filter( el => !!el.length )
            .map( el => el.trim() )
            .filter( el => !!el.length )
        ;

        this.commandName = elementsCmds[0] ;

        const args = elementsCmds.slice( 1 , ) ;

        this.sortArg( args ) ;

        return this ;
    }

    sortArg( args ) {

        this.argsCmd = args.filter( arg => (
            !Command.PATTERN_ARG_GLOBAL.test( arg ) &&
            !Command.PATTERN_ARG_FUNC.test( arg )
        ) ) ;

        this.argsGlobal = args.filter( arg => (
            Command.PATTERN_ARG_GLOBAL.test( arg )
        ) ) ;

        this.argsFunc = args.filter( arg => (
            Command.PATTERN_ARG_FUNC.test( arg )
        ) ) ;

        // check if the command name is an arg
        if( Command.PATTERN_ARG_FUNC.test( this.commandName ) ) {
            this.argsFunc.push( this.commandName ) ;
        } else if ( Command.PATTERN_ARG_GLOBAL.test( this.commandName ) ) {
            this.argsGlobal.push( this.commandName ) ;
        }

        return this ;
    }

} ;
