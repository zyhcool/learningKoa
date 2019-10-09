const http = require("http");
const event = require("events");
let context = require("./context");
let request = require("./request");
let response = require("./response");
const Stream = require("stream");

class Koa extends event.EventEmitter {
    constructor() {
        super();
        this.fn;
        this.context = context;
        this.request = request;
        this.response = response;
    }
    use(fn) {
        this.fn = fn;
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
        this.fn(ctx);
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
    }
}

module.exports = Koa;