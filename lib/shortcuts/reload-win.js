const {globalShortcut} = require('electron') ;

module.exports = {

    register: function( win ) {

        globalShortcut.register('CommandOrControl+r' , this.onReload( win ) ) ;
    } ,

    onReload: function( win ) {

        return force => {

            if( win.isFocused() || !!force ) {

                win.reload() ;
            }

        }
    }
}