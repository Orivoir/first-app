const {globalShortcut} = require('electron') ;

module.exports = function( win ) {

    // move window shortcuts
    const moveShortcuts = require('./move-win') ;
    const fsShortcuts = require('./fs-win') ;

    win.on('blur' , () => {

        globalShortcut.unregisterAll() ;

    } ) ;

    win.on('focus' , () => {

        moveShortcuts( win ) ;
        fsShortcuts( win ) ;

    } ) ;


} ;
