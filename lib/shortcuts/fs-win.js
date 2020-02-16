const {globalShortcut} = require('electron') ;

let fs = false ;

module.exports = {

    register: function( win ) {

        globalShortcut.register('Alt+Enter' , this.onToggleFs( win ) ) ;
    } ,

    onToggleFs: function( win ) {

        return force => {

            if( win.isFocused() || !!force ) {
                fs = !fs ;
                win.setFullScreen(fs) ;
            }

        } ;
    } ,

} ;