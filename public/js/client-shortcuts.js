// detect shortcuts from client

let engaged = false ;
let engagedWith = [] ;
let fire = null ;

const firesList = [
    /**
     * {
     *      model: string ,
     *      action: () => void
     * }
     */
] ;

const keyEngage = ['control','alt'] ;



// listen blur window server-side because can lost listen out/persist control key engaged
// e.g : alt+tab , swap window and block control key alt engaged
// but shortcuts client-side is dependencies with TCP/IP and Terminal script
// can't be re use :'(

// @TODO: see API visibility document MDN (https://developer.mozilla.org/fr/docs/Web/API/Page_Visibility_API)
// or other idea for resolve dependencies with an client script
try {

    Terminal.socket.on('win blur' , () => {
        // reset state engaged
        fire = null ;
        engaged = false;
        engagedWith = [] ;
    } ) ;

} catch( ReferenceError ) {
    // Terminal not exists inner this context
    // blur window or tab not listen
    // script broke
    throw "shortcuts client-side broke because this context cant use" ;
}

function checkFire() {

    const fireTry = engagedWith.join('+') +'+'+ fire ;

    const exec = firesList.find( exec => exec.model === fireTry ) ;

    if( exec ) {

        exec.action() ;
    } else {

        const idOut = new NextLineTerminal( {
            cwd: Terminal.cwd ,
            commandString: 'shortcuts' ,
            terminalList: Terminal.list
        } ).idOutput ;

        const outputElement = document.querySelector(`#${idOut}`) ;
        outputElement.textContent = `${fireTry} , is not an valid shortcuts` ;
    }
}


document.addEventListener('keydown' , ({key}) => {

    key = key.toLocaleLowerCase().trim() ;

    if( keyEngage.includes( key ) ) {

        engaged = true ;

        // have engaged an shortcut
        if(!engagedWith.includes( key )) {

            engagedWith.push( key ) ;
        }
    } else if( engaged ) {

        // have not press an control key
        // but is already engaged

        key = key.toLocaleLowerCase().trim() ;

        fire = key ;

        // if is an valid shortcut fire here
        checkFire() ;
    }

}) ;

document.addEventListener('keyup' , ({key}) => {

    key = key.toLocaleLowerCase().trim() ;

    if( keyEngage.includes( key ) ) {
        // have reject an control engaged

        // persist new state engaged
        engagedWith = engagedWith.filter( k => k !== key ) ;

        if( !engagedWith.length ) {
            // have reject full engaged
            engaged = false ;
            fire = null;
        }
    }

} ) ;