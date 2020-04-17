
const Koa = require('koa')
const app = new Koa()

const bodyparser = require('koa-bodyparser')
const cors = require('koa-cors');
const index = require('./routes')
const secret = require('./config/secret')
// const err = require('./middlreware/error')

const koa_static = require('koa-static');

app.use(cors());
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))

app.use(index.routes(), index.allowedMethods())

app.use(async (ctx,next)=>{
    const start = new Date();
    await next();
    const middle = new Date();
    const ms = middle - start;
    console.log(`${ctx.method} ${ctx.url} - 的时间${ms}`)
})

app.use(koa_static(__dirname + '/uploads'))


app.on('error',(err,ctx)=>{
    console.error('server error', err, ctx)
})

module.exports = app
