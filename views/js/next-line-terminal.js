class NextLineTerminal {

    constructor( {

        // string
        cwd ,

        // string
        commandString ,

        // HTMLUListElement
        terminalList
    } ) {

        this.cwd = cwd ;
        this.commandString = commandString ;

        this.idOutput = `output-${( Date.now() / Math.random() * 1.182 ).toString().replace('.','-') }` ;

        const wrap = NextLineTerminal.wrap ;

        wrap.innerHTML = this.innerHTML ;

        terminalList.insertBefore( wrap , NextLineTerminal.inputItem ) ;

    }

    static get wrap() {

        const li = document.createElement('li') ;

        li.className = "terminal-item terminal-item-output" ;

        return li ;
    }

    static get inputItem() {

        return document.querySelector('.terminal-item-input') ;
    }

    get innerHTML() {

        return `
            <section>

                <div>
                    <span>
                        ${this.cwd + ">"}
                    </span>
                    <span>
                        ${this.commandString}
                    </span>
                </div>

                <p id="${this.idOutput}"></p>

            </section>
        ` ;
    }

} ;
