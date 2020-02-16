const
    path = require('path') ,
    fs = require('fs')
;

function logout( app ) {

    this.on('logout' , () => {
        app.quit() ;
    } ) ;

}

function cd() {

    this.on('cd' , ({pathCd,cwd}) => {

        if( !path.isAbsolute( pathCd ) ) {

            pathCd = path.join( cwd , pathCd ) ;

        }

        fs.access( pathCd , err => {

            const eventName = `cd ${err ? "error" : "success"}` ;

            socket.emit(eventName , pathCd ) ;

        } ) ;

    } ) ;
}

function mkdir() {

    this.on('mkdir' , ({pathMkdir,cwd}) => {

        const dirname = path.basename( pathMkdir ) ;

        if( !dirname.length || dirname === "." ) {

            socket.emit('mkdir error' , {
                dirname: dirname,
                pathMkdir: pathMkdir
            } ) ;

        } else {

            fs.access( pathMkdir , err => {

                if( !err ) {

                    // if not error for access
                    // directory already exists
                    socket.emit('mkdir error' , {
                        dirname: dirname,
                        pathMkdir: pathMkdir
                    } ) ;

                } else {

                    if( !path.isAbsolute( pathMkdir ) ) {

                        pathMkdir = path.join( cwd ,pathMkdir ) ;
                    }

                    fs.mkdir( pathMkdir , {
                        // only append basename
                        recursive: false
                    } , err => {

                        if( err ) {

                            // create directory reject
                            // rules write inner parent dir invalid or
                            // directory name invalid
                            socket.emit('mkdir error' , {
                                dirname: dirname,
                                pathMkdir: pathMkdir
                            } ) ;
                        } else {

                            socket.emit('mkdir success' , {
                                dirname: dirname,
                                pathMkdir: pathMkdir
                            } ) ;
                        }

                    } ) ;
                }

            } ) ;

        }

    } ) ;

}

function ls() {

    this.on('ls' , ({pathLs,cwd}) => {

        if( !pathLs ) {
            // default path is the current work directory
            pathLs = "./" ;
        }

        if( !path.isAbsolute(pathLs) ) {

            pathLs = path.join( cwd , pathLs ) ;
        }


        fs.access( pathLs , err => {

            if( err ) {

                // path not exists
                // or not rules access from parent dir
                this.emit('ls error' , pathLs ) ;

            } else {

                fs.readdir( pathLs , {
                    encoding: 'utf-8' ,

                    withFileTypes: true,
                    // for get MIME-Type for each file
                    // but should normalized for transport TCP/IP
                    // else lost data mime-type :'(
                } , (err,items) => {


                    if( !err ) {

                        items = items.map( item => {

                            // transform Dirent[] (circual structure JSON)
                            // to JSON[] (no circular)
                            // for can parse datas with TCP/IP transform
                            return {

                                name: item.name,
                                isFile: item.isFile() ,
                                isSymbolicLink: item.isSymbolicLink() ,

                                // check if object is an:
                                // first-in-first-out (FIFO) pipe
                                isFIFO: item.isFIFO()
                            } ;

                        } ) ;

                        this.emit('ls success' , items ) ;
                    }

                    else
                        this.emit('ls error' , pathLs ) ;

                } ) ;

            }

        } ) ;

    } ) ;

}

module.exports = function( {
    io ,
    win ,
    app // electron main process
} ) {

    io.on('connect' , socket => {

        // bind TCP func
        logout = logout.bind( socket ) ;
        cd = cd.bind( socket ) ;
        mkdir = mkdir.bind( socket ) ;
        ls = ls.bind( socket ) ;

        logout( app ) ;

        cd() ;

        mkdir() ;

        ls() ;

    } ) ;

} ;
