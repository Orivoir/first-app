const
    path = require('path') ,
    fs = require('fs') ,

    // exec action even if window not focus
    FORCE_SHORTCUTS_ACTION = true
;

function logout( {app} ) {

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

            this.emit(eventName , pathCd ) ;

        } ) ;

    } ) ;
}

function mkdir() {

    this.on('mkdir' , ({pathMkdir,cwd}) => {

        const dirname = path.basename( pathMkdir ) ;

        if( !dirname.length || dirname === "." ) {

            this.emit('mkdir error' , {
                dirname: dirname,
                pathMkdir: pathMkdir
            } ) ;

        } else {

            fs.access( pathMkdir , err => {

                if( !err ) {

                    // if not error for access
                    // directory already exists
                    this.emit('mkdir error' , {
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
                            this.emit('mkdir error' , {
                                dirname: dirname,
                                pathMkdir: pathMkdir
                            } ) ;
                        } else {

                            this.emit('mkdir success' , {
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

function newFile() {

    this.on('new file' , ({filePath, cwd}) => {

        if( !filePath ) {

            this.emit('new file error' , ( {
                filePath: "",
                filename: ""
            } ) ) ;

        } else {

            if( !path.isAbsolute( filePath ) ) {

                filePath = path.join( cwd , filePath ) ;
            }

            const filename = path.basename( filePath ) ;
            fs.access( filePath , err => {

                if( !err ) {
                    // if not error access
                    // file already exists
                    this.emit('new file error' , ({
                        filePath: filePath,
                        filename: filename
                    } ) ) ;

                } else {

                    fs.appendFile( filePath , `/* create from Terminal Ipsum to at : ${new Date().toLocaleTimeString()} */` , {
                        encoding: 'utf-8' ,
                        mode: 0o6666 , // read and write open mode
                    } , err => {

                        if( err ) {

                            // chmod or other rules access have denied
                            // append new file
                            this.emit('new file error' , ({
                                filePath: filePath,
                                filename: filename
                            } ) ) ;

                        } else {

                            this.emit('new file success' , ({
                                filePath: filePath,
                                filename: filename
                            } ) ) ;

                        }

                    } ) ;
                }

            } ) ;
        }

    } ) ;

}

// fs name already use by filesystem module import
function fullscreen( {shortcutsFx} ) {

    this.on('fs' , () => {

        shortcutsFx.onToggleFs( FORCE_SHORTCUTS_ACTION ) ;
    } ) ;
}

module.exports = {

    // for map and bind funcs with socket as this
    funcsArray: [ logout , cd , mkdir, ls, newFile, fullscreen ] ,

    logout: logout ,
    cd: cd,
    mkdir: mkdir,
    ls: ls,
    newFile: newFile,
    fs: fullscreen
} ;
