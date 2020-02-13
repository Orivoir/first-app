const Terminal = {

    version: '0.1.0-alpha' ,
    cwd: 'c:\\' ,

    history: History ,
    input: document.querySelector('#command') ,

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

    init() {

        this
            .upgradeCwd()
            .upgradeVersion()
        ;

    }

} ;
