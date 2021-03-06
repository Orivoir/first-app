class Command {

    static get PATTERN_ARG_FUNC() {

        return /^[a-z]{1,50}\(.{0,}\)$/i ;
    }

    static get PATTERN_ARG_GLOBAL() {

        return /^(\-)(\-)/ ;
    }

    static get PATTERN_VAR() {

        return /^\$[a-z\_]{1}[a-z\_\d]{0,254}[ ]{0,}\=[ ]{0,}.{1,}/i ;
    }

    constructor({
        terminal ,
        commandString
    }) {

        if( !SocketCommand.worker ) {

            // listeners TCP/IP commands inner an litteral object
            // for not dupplicate listeners between two instances of self
            SocketCommand.init( terminal.socket , this ) ;
        }

        this.terminal = terminal ;

        this.commandString = commandString ;

        this.nextLine() ;

        this.explodeCommand() ;

        if( this.isValidCommandName ) {

            this.runCommandName() ;

        } else {

            // here not enter an command name
            // check if an exception e.g : define var , call/use global params

            if(
                !this.checkActionWithNotCommandName() &&
                this.isOnlyArgs
            ) {
                this.output = `"${this.commandName}" , is not an valid command` ;
            }
        }

        if( this.output ) {

            document.querySelector(`#${this.idOutput}`).textContent = this.output ;
        }

    }

    checkActionWithNotCommandName() {

        let isExec = true ;

        if( this.isVar ) {
            // is an define / set var.s
            this.cycleVars() ;
        }
        else if( this.isClearHistory ) {

            this.output = `history commands has been removed` ;
            this.terminal.history.clear() ;

        }  else if( this.isLogout ) {

            this.terminal.socket.emit('logout') ;
        } else if( this.isClearView ) {

            if( !this.terminal.header.classList.contains('hide') )
                this.terminal.header.classList.add('hide') ;

            // delete all output line
            NextLineTerminal.removeLines( this.terminal.list ) ;
        } else {

            isExec = false ;
        }

        return isExec ;
    }

    runCommandName() {

        const cmd = this.getCmdByName( this.commandName ) ;

        if( this[ cmd.normalize ] instanceof Function  ) {

            // here command have an function associate

            if( cmd.argsRequireLength > this.argsCmd ) {

                // !error arg length for commands

                this.output = `"${this.commandName}" , have ${cmd.argsRequireLength} args require` ;

            } else {

                this[ cmd.normalize ]() ;
            }

        } else {

            // command name inner build development
            this.output = `"${this.commandName}" , is valid command name but action in dev` ;
        }
    }

    cycleVars() {

        Vars.parse( this.commandString , this ) ;

        this.output = `${Vars.rejectsAffect.length} vars not write access, ${Vars.createsVar.length} vars has been created, ${Vars.upgradesVar.length} vars has been set` ;
    }

    echo() {

        const print = Vars.transform( this.argsCmd ).join(' ') ;

        const outputElement = document.querySelector(`#${this.idOutput}`) ;

        outputElement.textContent = `"${print}"` ;
    }

    cd() {

        const pathCd = this.asyncPrepare() ;

        this.asyncExec( 'cd' , {
            pathCd: pathCd
        } ) ;
    }

    mkdir() {

        const pathMkdir = this.asyncPrepare() ;

        this.asyncExec( 'mkdir' , {
            pathMkdir: pathMkdir
        } ) ;

    }

    ls() {

        const pathLs = this.asyncPrepare() ;

        this.asyncExec( 'ls', {
            pathLs: pathLs
        } ) ;
    }

    help() {

        const commandHelper = this.argsCmd[0] ;

        const outputElement = document.querySelector(`#${this.idOutput}`) ;

        const describe = (cmd,cmdName) => (
            `"${cmdName || commandHelper}" , describe : ${cmd.describe} , arg.s : ${cmd.argsLength} , args require.s : ${cmd.argsRequireLength} , read only : ${cmd.readOnly ? "yes": "no"}`
        ) ;

        if( !commandHelper ) {

            // all commands
            outputElement.innerHTML = `${commandsList.map( command => (
                describe( command , command.name )
            ) ).join('<br />')}`

        } else {

            const cmd = this.getCmdByName( commandHelper ) ;

            if( !cmd ) {
                outputElement.textContent = `"${commandHelper}" , not an valid command , if you want complet list enter : help or ?`
            } else {
                outputElement.textContent =  describe( cmd ) ;
            }
        }
    }

    newFile() {

        const filePath = this.asyncPrepare() ;

        this.asyncExec( 'new file' , {
            filePath: filePath
        } ) ;

    }

    removeFile() {

        const filePath = this.asyncPrepare() ;

        this.asyncExec( 'remove file' , {
            filePath: filePath
        } ) ;
    }

    fs() {

        const {socket} = this.terminal ;

        socket.emit('fs') ;
    }

    asyncExec( eventName , tcpTransfer ) {

        const {socket} = this.terminal ;

        socket.emit( eventName , ( {
            ...tcpTransfer ,
            cwd: this.terminal.cwd
        } ) ) ;
    }

    asyncPrepare() {

        this.isPendingAction = true ;

        SocketCommand.idOutput = this.idOutput ;

        return this.argsCmd[0] ;
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

    /**
     * @method sortArg
     * @param {string[]} args
     * @return {self} self
     *
     * @description sort args by `type` \
     * args function *e.g : clear() , unset( $i ) , exit()*
     * args global *e.g : --clear , --email , --user , --git*
     * args command *e.g : mkdir stuff , cd stuff*
     */
    sortArg( args ) {

        // if not global arg and not func arg is an command arg :-)
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

    // Getters check an command type

    /**
     * @description check if **command string** is an list of `vars` define
     */
    get isVar() {

        return Command.PATTERN_VAR.test( this.commandString ) ;
    }

    /**
     * @description check if ask close terminal
     */
    get isLogout() {

        return !![ ...this.argsGlobal , ...this.argsFunc , ...this.commandName ].find( arg => (
            /(logout|exit|quit)/.test( arg )
        ) )  || /(logout|exit|quit)/.test(this.commandName)  ;
    }

    /**
     * @description check if ask an empty screen
     */
    get isClearView() {

        return !!this.argsFunc.find( arg => (
            /clear\([ ]{0,}\)/.test( arg.trim() )
        ) ) ;

    }

    /**
     * @description check if ask an empty history **commands string**
     */
    get isClearHistory() {

        return (
            !!this.argsGlobal.find( arg => (
                /clear$/.test( arg )
            ) )
        ) ;

    }

} ;
