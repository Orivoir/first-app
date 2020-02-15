const
    exp = require('express') ,
    app = exp() ,
    server = require('http').Server( app ) ,
    io = require('socket.io')( server ) ,
    path = require('path') ,
    electron = require('electron')
;

app.use( '/assets' , exp.static( 'public' ) ) ;

io.on('connect' , socket => {

    socket.on('logout' , () => {

    } ) ;

} ) ;

app.get('/' , (req,res) => {

    res.sendFile( path.resolve( __dirname , './views/index.html' ) )

}  ) ;

server.listen( process.env.PORT || 3000 , () => {

    process.emit('ready') ;

} ) ;
