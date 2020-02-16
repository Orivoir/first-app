const {globalShortcut} = require('electron') ;

module.exports = function( win ) {

    let fs = false ;

    const onToggleFs = () => {

        if( win.isFocused() ) {
            fs = !fs ;
            win.setFullScreen(fs) ;
        }

    } ;

    globalShortcut.register('Alt+Enter' ,onToggleFs ) ;

    // reload ...
    globalShortcut.register('CommandOrControl+r' , () => {

        if( win.isFocused() ) {

            win.reload() ;
        }

    } ) ;

} ;
