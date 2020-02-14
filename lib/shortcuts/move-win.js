const {globalShortcut} = require('electron') ;

// shortcut move window [CtrlOrCommand]

// Ctrl+LeftArrow
// Ctrl+Alt+LeftArrow

// Ctrl+RightArrow
// Ctrl+Alt+RightArrow

// Ctrl+UpArrow
// Ctrl+Alt+UpArrow

// Ctrl+DownArrow
// Ctrl+Alt+UpArrow

const SPEED_MOVE = 5 ;

const onMove = function( moveType ,direction ,win ,position ) {

    return () => {

        if( !win.isFocused() ) return ;

        const biggerMoveType = /alt/i.test( moveType ) ;

        let POWER_MOVE = !biggerMoveType ? SPEED_MOVE : SPEED_MOVE * 3

        const index = /up|down/i.test( direction ) ? 1: 0 ;

        if( /up|left/i.test( direction ) ) POWER_MOVE = -POWER_MOVE ;

        position[index] = position[index] + POWER_MOVE ;

        win.setPosition( position[0] , position[1] ) ;

    } ;

} ;

module.exports = function( win ) {

    // int[x:int , y:int]
    let position = win.getPosition() ;

    ['up','down','left','right'].forEach( direction => {

        ['Alt+',''].forEach( moveType => {

            const controlKeyboard = `CommandOrControl+${moveType}${direction}`;

            globalShortcut.register(
                controlKeyboard ,
                onMove( moveType, direction , win , position )
            ) ;

        } ) ;

    } ) ;

} ;
