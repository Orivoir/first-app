class Command {

    static get PATTERN_ARG_FUNC() {

        return /^[a-z]{1,50}\([ ]{0,}\)$/i ;
    }

    static get PATTERN_ARG_GLOBAL() {

        return /^(\-)(\-)/ ;
    }

    constructor({
        terminal ,
        commandString
    }) {

        this.terminal = terminal ;

        this.commandString = commandString ;

        this.explodeCommand() ;

        if( this.isValidCommandName ) {

            // ...
            console.log( "valid command name" );

        } else if( !this.isOnlyArgs ) {

            this.output = `"${this.commandName}" , is not an valid command name` ;
        } else {

            if( this.isClearHistory ) {

                this.output = `history commands has been removed` ;
            }

            // ...
            console.log( "only args" );
        }

        this.nextLine() ;
    }

    getCmdByName( cmdName ) {

        return Command.cmdsList.find( cmd => (
            cmd.pattern.test( cmdName )
        ) ) ;
    }

    nextLine() {

        this.idOutputElement = new NextLineTerminal( {

            cwd: this.terminal.cwd ,
            commandString: this.commandString ,
            terminalList: this.terminal.list

        } ).idOutput ;

        document
            .querySelector( `#${this.idOutputElement}` )
            .textContent = this.output
        ;

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

        if( !this._isPendingAction ) {

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
