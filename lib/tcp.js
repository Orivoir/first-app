const
    // import tcp func
    tcpFxs = require('./tcp-func')
;

module.exports = function( {
    io ,
    win ,
    app, // electron main process
    shortcutsFx // functions shortcuts for manually fire from command line
} ) {

    io.on('connect' , socket => {

        // bind TCP func
        require('./bind-tcp-func')(
            socket ,
            tcpFxs.funcsArray
        ).forEach( tcpFxBinded => (
            tcpFxBinded( {app , win , shortcutsFx} )
        ) ) ;

    } ) ;

} ;
