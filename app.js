const Koa = require("./src/application");

let app = new Koa();

app.use((ctx) => {
    ctx.body = {
        code: 0,
        data: "hello world",
    }
    console.log(ctx.body);
})

app.listen(3000);
console.log("listening on 3000...")