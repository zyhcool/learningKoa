const event = require("events");
const http = require("http");
const context = require("./context")
const request = require("./request")
const response = require("./response")

class Koa extends event.EventEmitter {
    constructor() {
        super();
        this.middlewares = [];
        this.context = context;
        this.request = request;
        this.response = response;
    }

    use(fn) {
        this.middlewares.push(fn)
    }

    listen(...args) {
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
    }

    handleRequest(req, res) {
        const ctx = this.createContext(req, res);
        const fn = this.compose(this.middlewares, ctx);
        fn.then((value) => {
            res.end(JSON.stringify(ctx.body));
        })
            .catch((err) => {
                this.emit("error");
                res.statusCode = 500;
                res.end("Internal Error");
            })
    }

    createContext(req, res) {
        let ctx = Object.create(this.context);
        let request = ctx.request = Object.create(this.request);
        let response = ctx.response = Object.create(this.response);
        ctx.req = ctx.request.req = ctx.response.req = req;
        ctx.res = ctx.response.res = ctx.request.res = res;
        ctx.request.ctx = ctx.response.ctx = ctx;
        ctx.request.response = response;
        ctx.response.request = request;
        return ctx;
    }

    compose(middlewares, ctx) {
        function dipatch(index) {
            if (index === middlewares.length) {
                return;
            }
            const middleware = middlewares[index];
            return Promise.resolve(middleware(ctx, () => dipatch(index + 1)));
        }
        return dipatch(0);
    }
}

module.exports = Koa;