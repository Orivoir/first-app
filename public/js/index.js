/**
 * @author S.Gaborieau <sam.gabor@hotmail.com>
 *
 * @license BSD-2-CLAUSE
 * @version 0.1.0-alpha
 * @git <https://github.com/orivoir/first-app>
 *
 * @summary this file is entry point of `terminal-ui` app \
 *  this application is an usage test with: \
 *      **Electron** framework \
 *      **Express** framework \
 *      **Socket.io** library
 */
document.addEventListener('DOMContentLoaded' , () => {

    Terminal.init() ;

    // menu open/close
    const menuWrap = document.querySelector('footer') ;

    let openMenu = false ;

    const itemsMenu = document.querySelectorAll('footer nav ul li button') ;

    const onToggleMenu = () => {


        if( openMenu ) {
            // remove focus item menu before close
            itemsMenu.forEach( itemMenu => itemMenu.blur() ) ;
        }

        menuWrap.classList[ openMenu ? 'remove' : 'add' ]( 'open' )
        openMenu = !openMenu ;
    } ;

    firesList.push( {
        // open / close menu
        model: 'control+b' ,
        action: onToggleMenu
    } ) ;

    menuWrap.querySelector('.toggle-menu').addEventListener('click' , onToggleMenu ) ;

    // listen focus button menu because
    // focus auto-open menu O.o ...
    // but "openMenu" not change

    itemsMenu.forEach( itemMenu => (
        itemMenu.addEventListener('focus' , () => {

            if( !openMenu )
                onToggleMenu() ;

        } )

        // blur item not auto close menu
    ) )

} ) ;
