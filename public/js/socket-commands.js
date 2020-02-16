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
            .mkdir()
            .ls()
            .newFile()
            .removeFile()
        ;

    } ,

    get outputElement() {

        return document.querySelector(`#${this.idOutput}`) ;
    } ,

    ls() {

        const socket = this.worker ;

        socket.on('ls error' , path => {

            const outputElement = document.querySelector(`#${this.idOutput}`) ;

            outputElement.textContent = `"${path}" , not exists` ;

            this.cmd.isPendingAction = false ;

        } ) ;

        socket.on('ls success' , items => {

            this.cmd.isPendingAction = false ;

            const outputElement = document.querySelector(`#${this.idOutput}`) ;

            outputElement.innerHTML = items.map( (item,key) => (
                `
                    ${item.name} -${item.isFile ? 'f':'d'}-  ${item.isSymbolicLink ? "[Symbolic Link]" :""} ${item.isFIFO ? "[FIFO]":""} ${!((key+1) %2) ? "<br />":"<span class='tab'></span>"}
                `
            ) ).join(' ') ;

        } ) ;

        return this ;
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
    } ,

    mkdir() {

        const socket = this.worker ;

        socket.on('mkdir error' , ({
            dirname,
            pathMkdir
        }) => {

            this.cmd.isPendingAction = false ;

            const outputElement = document.querySelector(`#${this.idOutput}`) ;

            outputElement.textContent = `"${dirname}" , cant create in "${pathMkdir}"` ;

        } ) ;

        socket.on('mkdir success' , ({
            dirname: dirname,
            pathMkdir: pathMkdir
        }) => {

            this.cmd.isPendingAction = false ;

            const outputElement = document.querySelector(`#${this.idOutput}`) ;

            outputElement.textContent = `"${dirname}" , has been created in ${pathMkdir}` ;

        } ) ;

        return this ;
    } ,

    newFile() {

        const socket = this.worker ;

        socket.on('new file error' , ({
            filePath,
            filename
        } ) => {

            this.cmd.isPendingAction = false ;

            this.outputElement.textContent = `"${filename}" , cant create in "${filePath}"` ;
        } ) ;

        socket.on('new file success' , ({
            filePath,
            filename
        }) => {

            this.cmd.isPendingAction = false ;

            this.outputElement.textContent = `"${filename}" , have been create in "${filePath}"` ;

        } ) ;

        return this ;
    } ,

    removeFile() {

        const socket = this.worker ;

        socket.on('remove file error' , ({
            filePath,
            filename
        } ) => {

            this.cmd.isPendingAction = false ;

            this.outputElement.textContent = `"${filename}" , cant remove in "${filePath}"` ;
        } ) ;

        socket.on('remove file success' , ({
            filePath,
            filename
        }) => {

            this.cmd.isPendingAction = false ;

            this.outputElement.textContent = `"${filename}" , have been remove in "${filePath}"` ;

        } ) ;

        return this ;
    }

} ;
