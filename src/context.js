let proto = {}

// 代理
function defineGetter(prop, name) {
    return Reflect.defineProperty(proto, name, {
        get() {
            return this[prop][name];
        }
    })
}

//
function defineSetter(prop, name) {
    return Reflect.defineProperty(proto, name, {
        set(value) {
            this[prop][name] = value;
        }
    })
}

function defineGetter_Setter(prop, name) {
    return Reflect.defineProperty(proto, name, {
        get(){
            return this[prop][name];
        },
        set(value) {
            this[prop][name] = value;
        }
    })
}

// 将 prop 的参数 name 代理到 ctx 上
defineGetter('request', 'url');
defineGetter('request', 'path');
// 取 ctx.url 时，实际上是取 ctx.request.url 的值
// 同理，取 ctx.path 时，实际上是取 ctx.request.path 的值

defineGetter_Setter("response", "body");


module.exports = proto;