const http = require("http");
const event = require("events");
let context = require("./context");
let request = require("./request");
let response = require("./response");
const Stream = require("stream");

class Koa extends event.EventEmitter {
    constructor() {
        super();
        this.context = context;
        this.request = request;
        this.response = response;
        this.middlewares = [];
    }
    use(fn) {
        this.middlewares.push(fn);
    }
    listen(...args) {
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
    }
    createContext(req, res) {
        let ctx = Object.create(this.context);
        const request = ctx.request = Object.create(this.request);
        const response = ctx.response = Object.create(this.response);
        ctx.req = request.req = response.req = req;
        ctx.res = request.res = response.res = res;
        request.ctx = response.ctx = ctx;
        request.response = response;
        response.request = request;
        return ctx;
    }
    handleRequest(req, res) {
        let ctx = this.createContext(req, res);
        let fn = this.compose(this.middlewares, ctx);
        fn.then((value) => {
            if (typeof ctx.body == 'object') {
                res.setHeader('Content-Type', 'application/json;charset=utf8')
                res.end(JSON.stringify(ctx.body))
            } else if (ctx.body instanceof Stream) {
                ctx.body.pipe(res)
            }
            else if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) {
                res.setHeader('Content-Type', 'text/html; charset=utf8')
                res.end(ctx.body)
            } else {
                res.end('Not found')
            }
        })
            .catch((err) => {
                this.emit(err);
                res.statusCode = 500;
                res.end("Internal Error");
            })
    }
    compose(middlewares, ctx) {
        function dipatch(index) {
            if (index === middlewares) {
                return Promise.resolve();
            }
            let middleware = middlewares[index];
            return Promise.resolve(middleware(ctx, () => dipatch(index + 1)));
        }
        return dipatch(0);
    }
}

module.exports = Koa;