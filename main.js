const {app,BrowserWindow} = require('electron') ;
const path = require('path') ;
const fs = require('fs') ;

app.on('window-all-closed' , () => app.quit() ) ;

function createWindow( io ) {

    const win = new BrowserWindow( {
        width: 750,
        height: 425,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    } ) ;

    require('./lib/tcp')( { io , win , app } ) ;

    win.loadURL('http://localhost:3000/') ;

    win.setOpacity( .9 ) ;

    win.webContents.openDevTools() ;

    win.removeMenu() ;

    // call global shortcuts
    require('./lib/shortcuts/endpoint')( win ) ;
}

// server
const
    exp = require('express') ,
    routerHTTP = exp() ,
    server = require('http').Server( routerHTTP ) ,
    io = require('socket.io')( server )

    // already import but think re import after re factoring
    // path = require('path')
;

routerHTTP.use( '/assets' , exp.static( 'public' ) ) ;

routerHTTP.get('/' , (req,res) => {

    res.sendFile( path.resolve( __dirname , './views/index.html' ) ) ;

} ) ;

server.listen( process.env.PORT || 3000 , () => {

    console.log('HTTP ready') ;

    app.whenReady().then( () => {

        console.log('Window run');

        createWindow( io ) ;

    } ) ;

} ) ;
