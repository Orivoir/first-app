# Terminal UI

## Terminal UI with electron app test

- ```git clone https://github.com/Orivoir/first-app.git```
- ```cd first-app```
- ```npm install```
- ```npm start```

### commands list ( metadatas )
```js
    [
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
        readOnly: false ,
        describe: 'change the current work directory'
    } ,

    // mkdir
    {
        pattern: /^mkdir(ectory)?$/ ,
        argsLength: 1 ,
        argsRequireLength: 1 ,
        normalize: 'mkdir' ,
        readOnly: false ,
        describe: 'create an new directory'
    } ,

    // fs
    {
        pattern: /^(fs|fullscreen|fulls|fscreen)$/ ,
        argsLength: 0,
        argsRequireLength: 0,
        normalize: 'fs' ,
        readOnly: true,
        describe: 'switch state fullscreen mode'
    } ,

    // echo
    {
        pattern: /^(echo|print)$/ ,
        argsLength: 1 ,
        argsRequireLength: 1 ,
        normalize: 'echo' ,
        readOnly: true,
        describe: 'log an string value'
    } ,

    // newFile
    {
        pattern: /^(new|create|add|app(end)?)\-(item|file)$/ ,
        argsLength:1,
        argsRequireLength: 1,
        readOnly: false,
        describe: 'append an new file' ,
        normalize: 'newFile'
    } ,

    // logout
    {
        pattern: /^(logout|exit|quit)$/ ,
        argsLength: 0,
        argsRequireLength: 1 ,
        readOnly: true ,
        describe: 'close the current terminal' ,
        normalize: 'logout'
    } ,

    // removeFile
    {
        pattern: /^(remove|rm|del(ete)?)(\-)(file|item)|unset$/ ,
        argsLength: 1 ,
        argsRequireLength: 1 ,
        readOnly: false ,
        describe: 'delete the target file' ,
        normalize: 'removeFile'
    } ,

    // rnameItem
    {
        pattern: /^rname(\-(item|file|dir(ectory)?))?$/ ,
        argsLength: 1 ,
        argsRequireLength: 1 ,
        readOnly: false,
        describe: 're name the target item ( file or directory )' ,
        normalize: 'rnameItem'
    } ,

    // run
    {
        pattern: /^(exe(cute)?|run|start)$/ ,
        argsLength: 1,
        argsRequireLength: 1 ,
        normalize: 'run' ,
        describe: 'execute the target file with default programm associate'
    } ,

    // ajax
    {
        pattern: /^(curl|ajax)(rq|request)?$/ ,
        argsLength: Infinity ,
        argsRequireLength: 1 ,
        readOnly: false,
        normalize: 'ajax' ,
        describe: 'send an AJAX request on an target URI'
    } ,

    // ls
    {
        pattern: /^(ls?|list)$/ ,
        argsLength: 1 ,
        argsRequireLength: 0 ,
        readOnly: true ,
        normalize: 'ls' ,
        describe: 'show items list in the current work directory'
    } ,

    // help
    {
        pattern: /^(help|\?)$/ ,
        argsLength: 0 ,
        argsRequireLength: 0 ,
        normalize: 'help' ,
        readOnly: true ,
        describe: 'helper list commands'
    } ,
    ]
```

### The `normalize` attribute is the function name to exec action
