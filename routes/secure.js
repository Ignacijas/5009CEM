
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

router.get('/details/:account', async ctx => {
	const studentcv = await new Studentcv(dbName)
	try {
		console.log(`record: ${ctx.params.account}`)
		ctx.hbs.cv = await studentcv.getByID(ctx.params.account)
		console.log(ctx.hbs)
		ctx.hbs.account = ctx.params.account
		await ctx.render('details', ctx.hbs)
	} catch(err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	}
})

router.get('/add', async ctx => {
	await ctx.render('add', ctx.hbs)
})

router.post('/add', async ctx => {
	const studentcv = await new Studentcv(dbName)
	try{
		ctx.request.body.account = ctx.session.userid
		if(ctx.request.files.photo.name) {
			ctx.request.body.filePath = ctx.request.files.photo.path
			ctx.request.body.fileName = ctx.request.files.photo.name
			ctx.request.body.fileType = ctx.request.files.photo.type
 		}
		await studentcv.add(ctx.request.body)
		console.log('adding a CV')
		return ctx.redirect('/secure?msg=new CV added')
	} catch(err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	} finally {
		studentcv.close()
	}
})

export default router
