const commandsList = [

    /*
        {
            pattern: regexp ,
            argsLength: int ,
            argsRequireLength: int ,
            normalize: string ,
            readOnly: bool ,
            describe: string,
        }
    */

    // cd
    {
        pattern: /^c(w?)d$/ ,
        argsLength: 1 ,
        argsRequireLength: 1 ,
        normalize: 'cd' ,
        readOnly: true ,
        describe: 'change the current work directory' ,
        name: 'cd'
    } ,

    // mkdir
    {
        pattern: /^mkdir(ectory)?$/ ,
        argsLength: 1 ,
        argsRequireLength: 1 ,
        normalize: 'mkdir' ,
        readOnly: false ,
        describe: 'create an new directory' ,
        name: 'mkdir'
    } ,

    // fs
    {
        pattern: /^(fs|fullscreen|fulls|fscreen)$/ ,
        argsLength: 0,
        argsRequireLength: 0,
        normalize: 'fs' ,
        readOnly: true,
        describe: 'switch state fullscreen mode' ,
        name: 'fs'
    } ,

    // echo
    {
        pattern: /^(echo|print)$/ ,
        argsLength: 1 ,
        argsRequireLength: 1 ,
        normalize: 'echo' ,
        readOnly: true,
        describe: 'log string value' ,
        name: 'echo'
    } ,

    // newFile
    {
        pattern: /^(new|create|add|app(end)?)\-(item|file)$/ ,
        argsLength:1,
        argsRequireLength: 1,
        readOnly: false,
        describe: 'append an new file' ,
        normalize: 'newFile' ,
        name: 'new-file'
    } ,

    // logout
    {
        pattern: /^(logout|exit|quit)$/ ,
        argsLength: 0,
        argsRequireLength: 1 ,
        readOnly: true ,
        describe: 'close the current terminal' ,
        normalize: 'logout' ,
        name: 'logout' ,
    } ,

    // removeFile
    {
        pattern: /^(remove|rm|del(ete)?)(\-)(file|item)$/ ,
        argsLength: 1 ,
        argsRequireLength: 1 ,
        readOnly: false ,
        describe: 'delete the target file' ,
        normalize: 'removeFile' ,
        name: 'remove-file'
    } ,

    // rnameItem
    {
        pattern: /^rname(\-(item|file|dir(ectory)?))?$/ ,
        argsLength: 1 ,
        argsRequireLength: 1 ,
        readOnly: false,
        describe: 're name the target item ( file or directory )' ,
        normalize: 'rnameItem' ,
        name: 'rname-item'
    } ,

    // run
    {
        pattern: /^(exe(cute)?|run|start)$/ ,
        argsLength: 1,
        argsRequireLength: 1 ,
        normalize: 'run' ,
        describe: 'execute the target file with default programm associate' ,
        name: 'run'
    } ,

    // ajax
    {
        pattern: /^(curl|ajax)(rq|request)?$/ ,
        argsLength: Infinity ,
        argsRequireLength: 1 ,
        readOnly: false,
        normalize: 'ajax' ,
        describe: 'send an AJAX request on an target URI' ,
        name: 'ajax'
    } ,

    // ls
    {
        pattern: /^(ls?|list)$/ ,
        argsLength: 1 ,
        argsRequireLength: 0 ,
        readOnly: true ,
        normalize: 'ls' ,
        describe: 'show items list in the current work directory' ,
        name: 'ls'
    } ,

    // help
    {
        pattern: /^(help|\?)$/ ,
        argsLength: 0 ,
        argsRequireLength: 0 ,
        normalize: 'help' ,
        readOnly: true ,
        describe: 'helper list commands' ,
        name: 'help'
    } ,

] ;
