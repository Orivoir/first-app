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
