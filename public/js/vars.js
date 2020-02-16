// @TODO: add an free malloc function `(varName:string) => boolean`

const Vars = {

    state: [
        {
            key: "$HOST" ,
            val: "127.0.0.1:3000" ,
            writable: false ,
        } , {

            key: "$AUTHOR" ,
            val: "Orivoir21" ,
            writable: false ,
        }
    ] ,

    get notWritable() {

        return this.state.filter( _var => _var.writable === false ) ;

    } ,

    transform( arrStr ) {

        return arrStr.map( print => {

            const usual = print.trim() ;

            if( usual.charAt( 0 ) === "$" ) {

                const _var = this.getVarByKey( usual ) ;

                if( !!_var ) {

                    return _var.val ;

                } else {
                    // ReferenceError
                    return `<ReferenceError: ${usual}>`
                }


            } else {
                // static string
                return print ;
            }

        } ) ;

    } ,

    setState() {

        // for output
        this.upgradesVar = [] ;

        // upgrade var already exists
        this.state = this.state.map( _var => {

            const newVar = this.isRedefine( _var.key ) ;

            if( !!newVar ) {
                _var.val = newVar.val ;
                _var.writable = newVar.writable ;
                this.upgradesVar.push( newVar ) ;
            }

            return _var ;

        } ) ;

        // for output
        this.createsVar = [] ;

        // add new vars
        this.varsNormalized.forEach( vNormalized => {

            if( !this.alreadyExists( vNormalized.key ) ) {

                this.createsVar.push( vNormalized ) ;
                this.state.push( vNormalized ) ;
            }

        } ) ;
    } ,

    alreadyExists( key ) {

        return !!this.state.find( _var => _var.key === key ) ;

    } ,

    isRedefine( key ) {

        return this.varsNormalized.find( _v => _v.key === key ) ;

    } ,

    isProtect( key ) {

        const {notWritable} = this ;

        return !!notWritable.find( _var => _var.key === key ) ;

    } ,

    checkNotAuthorizeAffect() {

        this.rejectsAffect = [] ;

        this.varsNormalized = this.varsNormalized.filter( varNormalized => {

            if( this.isProtect( varNormalized.key )  ) {

                this.rejectsAffect.push( varNormalized ) ;
                return false ;
            }

            return true ;
        } ) ;

    } ,

    getVarByKey( key ) {

        return this.state.find( _var => _var.key === key ) || null ;

    } ,

    normalize( varParsed ) {

        varParsed = varParsed
        .map( vParse => {

            const save = {
                key: vParse[0]
            } ;

            let [val,writable] = vParse[1].split('|') ;

            writable = !/(read(only)?|r(d)?o(n)?(l)?(y)?)/i.test(writable) ;

            save.val = val ;
            save.writable = writable ;

            return save ;
        } ) ;

        this.varsNormalized = varParsed ;

        this.checkNotAuthorizeAffect() ;
        this.setState() ;
    } ,

    parse( varstr  ) {

        varstr = varstr
            .trim()
            .split(';')
            .map( _var => (
                _var
                    .trim()
                    .split('=')
                    .map( key => (
                        key.trim()
                    ) )
            ) )
            .filter( _var => _var.length === 2 ) // exlude last ";" char
        ;

        this.normalize( varstr ) ;

        return this ;
    }

} ;
