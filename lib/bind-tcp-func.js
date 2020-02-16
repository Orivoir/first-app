module.exports = function( socket , funcs ) {

    return funcs
    .filter( func => func instanceof Function )
    .map( func => (
        func = func.bind( socket )
    ) ) ;

} ;
