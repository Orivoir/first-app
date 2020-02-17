if( !(io instanceof Function) ) {

    throw 'socket.io application is not loaded' ;
}

const Terminal = {

    version: '0.1.0-alpha' ,
    _cwd: 'c:\\' ,
    socket: io('/') ,

    get cwd() {
        return this._cwd;
    } ,
    set cwd(cwd) {
        this._cwd = typeof cwd === "string" ? cwd : "c:\\" ;

        this.upgradeCwd() ;
    } ,

    history: History ,

    Command: Command ,

    input: document.querySelector('#command') ,
    list: document.querySelector('.terminal-list') ,
    header: document.querySelector('header') ,

    isListenInput: false ,

    upgradeVersion() {

        [ ...document.querySelectorAll('.version') ]
        .forEach( versionEl => (
            versionEl.textContent = this.version
        ) ) ;

        return this ;
    } ,

    upgradeCwd() {

        [ ...document.querySelectorAll('.cwd') ]
        .forEach( cwdEl => (
            cwdEl.textContent = this.cwd + ">"
        ) ) ;

        return this ;

    } ,

    // listen input method
    useHistory() {

        this.input.addEventListener('keydown' , ({key}) => {

            if( /arrow(up|down)/i.test( key ) ) {
                // have press arrow on axis Y

                const direction = /down/i.test( key ) ? 'previous': 'next' ;

                const cmdName = this.history[ direction ] ;

                if( !!cmdName ) {

                    this.input.value = cmdName ;
                }
            }

        } ) ;

        return this ;
    } ,

    // listen input method
    enterCmd() {

        this.input.addEventListener('keydown' , ({key}) => {

            if( /^enter$/i.test(key) ) {
                // have press enter key

                const cmdString = this.input.value ;

                this.input.value = "" ;

                const command = new this.Command( {
                    terminal: this ,
                    commandString: cmdString
                } ) ;

                if( !command.isClearHistory ) {

                    this.history.add( cmdString ) ;
                }

            }

        } ) ;

        return this ;

    } ,

    listenInput() {

        this
            .useHistory()
            .enterCmd()
        ;

        return this ;
    } ,

    init() {

        this
            .upgradeCwd()
            .upgradeVersion()
            .listenInput()
        ;

        document.addEventListener('click' , () => (
            this.input.focus()
        ) ) ;

    }

} ;