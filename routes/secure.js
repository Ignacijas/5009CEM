
import Router from 'koa-router'

const router = new Router({ prefix: '/secure' })

import Studentcv from '../modules/studentcv.js'
const dbName = 'website.db'

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	await next()
}

router.use(checkAuth)

router.get('/', async ctx => {
  const studentcv = await new Studentcv(dbName)
	try {
    const records = await studentcv.all()
    console.log(records)
    ctx.hbs.records = records
		await ctx.render('secure', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

router.get('/details/:id', async ctx => {
  const studentcv = await new Studentcv(dbName)
	try {
    console.log(`record: ${ctx.params.id}`)
    ctx.hbs.cv = await studentcv.getByID(ctx.params.id)
    console.log(ctx.hbs)
    ctx.hbs.id = ctx.params.id
		await ctx.render('details', ctx.hbs)
	} catch(err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	}
})



export default router
