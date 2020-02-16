const {globalShortcut} = require('electron') ;

// shortcut move window [CtrlOrCommand+Alt+{arrow direction}]

const SPEED_MOVE = 5 ;

module.exports = {

    register: function( win ) {

        ['up','down','left','right'].forEach( direction => {

            const controlKeyboard = `CommandOrControl+Alt+${direction}`;

            globalShortcut.register(
                controlKeyboard ,
                this.onMove( win , direction )
            ) ;

        } ) ;

    } ,

    onMove: function( win , direction  ) {

        return ( force, manuallyDirection  ) => {

            if( !win.isFocused() && !force ) return ;

            if( !direction )
                direction = manuallyDirection ;

            const position = win.getPosition() ;

            let POWER_MOVE = /up|left/i.test( direction ) ? -SPEED_MOVE: SPEED_MOVE ;

            // axis index
            const index = /up|down/i.test( direction ) ? 1: 0 ;

            position[index] += POWER_MOVE ;

            win.setPosition( position[0] , position[1] ) ;

        } ;
    }

} ;
