const
    // import tcp func
    tcpFxs = require('./tcp-func')
;

module.exports = function( {
    io ,
    win ,
    app // electron main process
} ) {

    io.on('connect' , socket => {

        // bind TCP func
        require('./bind-tcp-func')(
            socket ,
            tcpFxs.funcsArray
        ).forEach( tcpFxBinded => (
            tcpFxBinded( app , win )
        ) ) ;

    } ) ;

} ;
