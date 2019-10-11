let context = {

}

function __defineGetter(o, d) {
    Object.defineProperty(context, d, {
        get() {
            return this[o][d];
        }
    })
}

function __defineSetter(o, d) {
    Object.defineProperty(context, d, {
        set(value) {
            this[o][d] = value;
        }
    })
}

function __defineGetter_Setter(o, d) {
    Object.defineProperty(context, d, {
        get (){
            return this[o][d];
        },
        set(value) {
            this[o][d] = value;
        },
    })
}

__defineGetter("request", "path");
__defineGetter("request", "url");

__defineGetter_Setter("response","body");


module.exports = context;