const {globalShortcut} = require('electron') ;

const moveShortcuts = require('./move-win') ;
const fsShortcuts = require('./fs-win') ;
const reloadShortcuts = require('./reload-win') ;

let actions = null ;

const hydrateActions = win => {

    actions =  {
        onReload: reloadShortcuts.onReload( win ),
        onToggleFs: fsShortcuts.onToggleFs( win ),
        onMove: moveShortcuts.onMove( win )
    } ;
}

module.exports = {

    listeners( win ) {

        hydrateActions( win ) ;

        win.on('blur' , () => {

            globalShortcut.unregisterAll() ;
        } ) ;

        win.on('focus' , () => {

            moveShortcuts.register( win ) ;
            fsShortcuts.register( win ) ;
            reloadShortcuts.register( win ) ;

        } ) ;

    } ,

    get actions() {
        return actions ;
    }
} ;

