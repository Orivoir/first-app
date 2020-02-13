const {globalShortcut} = require('electron') ;

module.exports = function( win ) {

    // move window shortcuts
    require('./move-win')( win ) ;

    // shortcut switch fullscreen
    let fs = false ;

    globalShortcut.register('Alt+Enter' , () => {

        if( win.isFocused() ) {
            fs = !fs ;
            win.setFullScreen(fs) ;
        }

    } ) ;

    globalShortcut.register('CommandOrControl+r' , () => {

        if( win.isFocused() ) {

            win.reload() ;
        }

    } ) ;

} ;
