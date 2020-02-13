const History = {

    add( cmdName ) {

        this.cmds.unshift( cmdName ) ;
        this.index-- ;
    } ,

    remove( cmdName ) {

        this.cmds = this.cmds.filter( c => (
            cmdName !== c
        ) ) ;

        this.index = 0 ;

    } ,

    clear() {

        this.cmds = [] ;
        this.index = 0 ;

    } ,

    get next() {

        this.index++;

        return this.current ;
    } ,
    get previous() {

        this.index-- ;

        return this.current ;

    } ,

    get current() {

        return this.cmds[ this.index ] ;
    } ,

    _index: 0 ,

    cmds: [] ,

    get index() {

        return this._index;
    } ,
    set index( index ) {

        this._index = ( typeof index === 'number' ) ? index: 0 ;

        if( this._index < 0 ) {

            this._index = ( this.cmds.length - 1 ) ;

        } else if( this._index >= this.cmds.length ) {

            this._index = 0 ;

        }

    }

} ;
