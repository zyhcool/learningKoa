const Koa = require("./application");

let app = new Koa();

app.use(async (ctx, next)=>{
    console.log(ctx);
    console.log(ctx.request)
    console.log(ctx.response)
    console.log(ctx.path)
    console.log(ctx.url)
    ctx.body = {
        code: 0,
        data: "hahah",
    }
    await next();
})

app.listen(3000)

console.log("listening on 3000 ...")