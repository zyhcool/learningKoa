const handleRequest = function (req, res) {
    let ctx = createContext(req, res);
    let response = compose(middlewares, ctx);
    response.then((value)=>{
        handleResponse(ctx);
    })

}

function createContext(req, res) {
    // ...
}

function compose(middlewares, ctx) {
    return dipatch(0);
    function dipatch(index) {
        if (index === middlewares.length) {
            return Promise.resolve();
        }
        return Promise.resolve(middlewares[index](ctx, () => dipatch(index + 1)))
    }
}

function handleResponse(ctx){
    // ....
}