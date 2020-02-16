module.exports =
/**
 * @param {object} socket
 * @param {[() => void]} funcs
 * @description bind `TCP` **functions** with `socket` **instance** *as* **this**
 */
function( socket , funcs ) {

    return funcs
    .filter( func => func instanceof Function )
    .map( func => (
        func = func.bind( socket )
    ) ) ;

} ;
