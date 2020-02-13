const {app,BrowserWindow} = require('electron') ;

app.on('window-all-closed' , () => app.quit() ) ;

function createWindow() {

    const win = new BrowserWindow({
        width: 750,
        height: 425,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    } ) ;

    win.loadFile('./views/index.html') ;

    win.setOpacity( .9 ) ;

    win.removeMenu() ;

    // call global shortcuts
    require('./lib/shortcuts/endpoint')( win ) ;
}

app.whenReady().then( () => {

    createWindow() ;

} ) ;
