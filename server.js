require('dotenv').config()

const Koa = require('koa')
const Router = require('koa-joi-router')
const Joi = Router.Joi

const errorHandler = require('koa-better-error-handler')
const koa404Handler = require('koa-404-handler')
const Boom = require('@hapi/boom')
const bodyParser = require('koa-bodyparser')

const nbx = require('noblox.js')

const app = new Koa()
const router = Router()

const { COOKIE, API_TOKEN, MAX_RANK, PORT } = process.env

app.context.onerror = errorHandler()
app.context.api = true
app.use(koa404Handler)
app.use(bodyParser())

let loggedIn = false

async function authenticate (ctx) {
  if (ctx.request.headers.authorization !== API_TOKEN) {
    ctx.throw(Boom.unauthorized('Authorization header does not match API_TOKEN.'))
  }
}

async function nbxAuthenticate (ctx) {
  if (!loggedIn) {
    ctx.throw(Boom.unauthorized('You are not logged into a Roblox account, please update COOKIE.'))
  }
}

async function throwError (ctx, error) {
  const boomResponse = error
  ctx.status = boomResponse.output.statusCode
  ctx.body = boomResponse.output.payload
}

router.get('/', async (ctx) => {
  ctx.status = 200
})

// GET username from ID route
router.route({
  method: 'get',
  path: '/get-username-from-id/:id',
  handler: async (ctx) => {
    await nbx.getUsernameFromId(ctx.params.id).then(function (username) {
      ctx.body = {
        success: true,
        data: username
      }
    }).catch(function (err) {
      ctx.throw(Boom.notFound(err))
    })
  }
})

// GET ID from username route
router.route({
  method: 'get',
  path: '/get-id-from-username/:username',
  handler: async (ctx) => {
    await nbx.getIdFromUsername(ctx.params.username).then(function (username) {
      ctx.body = {
        success: true,
        data: username
      }
    }).catch(function (err) {
      ctx.throw(Boom.notFound(err))
    })
  }
})

// GET a player's information
router.route({
  method: 'get',
  path: '/user/:id',
  pre: async (ctx, next) => {
    await authenticate(ctx, next)
    return next()
  },
  handler: async (ctx) => {
    if (ctx.invalid) {
      await throwError(ctx, Boom.badRequest(ctx.invalid.body))
      return
    }
    return nbx.getPlayerInfo(ctx.params.id).then((playerInfo) => {
      ctx.status = 200
      ctx.body = playerInfo
    }).catch((err) => {
      return throwError(ctx, Boom.badRequest(err.message))
    })
  }
})

// POST a response to a user join request
router.route({
  method: 'post',
  path: '/group/:group/handle-join-request',
  validate: {
    type: 'json',
    body: Joi.object({
      target: Joi.number().required(),
      accept: Joi.boolean().required()
    }),
    continueOnError: true
  },
  pre: async (ctx, next) => {
    await authenticate(ctx, next)
    await nbxAuthenticate(ctx, next)
    return next()
  },
  handler: async (ctx) => {
    if (ctx.invalid) {
      await throwError(ctx, Boom.badRequest(ctx.invalid.body))
      return
    }

    return nbx.handleJoinRequest(ctx.request.params.group, ctx.request.body.target, ctx.request.body.accept).then(() => {
      ctx.status = 200
      ctx.body = {
        success: true,
        message: `User's join request was ${ctx.request.body.accept ? 'accepted' : 'declined'} successfully.`
      }
    }).catch((err) => {
      console.log(err)
      return throwError(ctx, Boom.unauthorized(err.message))
    })
  }
})

// POST a group shout
router.route({
  method: 'post',
  path: '/group/:group/shout',
  validate: {
    type: 'json',
    body: Joi.object({
      message: Joi.string().required()
    }),
    continueOnError: true
  },
  pre: async (ctx, next) => {
    await authenticate(ctx, next)
    await nbxAuthenticate(ctx, next)
    return next()
  },
  handler: async (ctx) => {
    if (ctx.invalid) {
      await throwError(ctx, Boom.badRequest(ctx.invalid.body))
      return
    }

    return nbx.shout(ctx.request.params.group, ctx.request.body.message).then((res) => {
      ctx.status = 200
      ctx.body = res
    }).catch((err) => {
      return throwError(ctx, Boom.unauthorized(err.message))
    })
  }
})

// DELETE a user (exile)
router.route({
  method: 'delete',
  path: '/group/:group/member/:target',
  pre: async (ctx, next) => {
    await authenticate(ctx, next)
    await nbxAuthenticate(ctx, next)
    return next()
  },
  handler: async (ctx) => {
    if (ctx.invalid) {
      await throwError(ctx, Boom.badRequest(ctx.invalid.body))
      return
    }

    return nbx.exile(ctx.params.group, ctx.params.target).then(() => {
      ctx.status = 200
      ctx.body = {
        success: true
      }
    }).catch((err) => {
      return throwError(ctx, Boom.badRequest(err.message))
    })
  }
})

// POST to the rank of a user
router.route({
  method: 'post',
  path: '/group/:group/member/:target/rank',
  validate: {
    type: 'json',
    body: Joi.object({
      rank: Joi.number().min(1).max(Number(MAX_RANK) || 254),
      role: Joi.string()
    }).xor('rank', 'role'),
    continueOnError: true
  },
  pre: async (ctx, next) => {
    await authenticate(ctx, next)
    await nbxAuthenticate(ctx, next)
    return next()
  },
  handler: async (ctx) => {
    if (ctx.invalid) {
      await throwError(ctx, Boom.badRequest(ctx.invalid.body))
      return
    }

    return nbx.setRank(ctx.request.params.group, ctx.request.params.target, ctx.request.body.rank || ctx.request.body.role).then((res) => {
      ctx.status = 200
      ctx.body = res
    }).catch((err) => {
      return throwError(ctx, Boom.badRequest(err.message))
    })
  }
})

// POST to the rank of a user by providing a value to change it by
router.route({
  method: 'post',
  path: '/group/:group/member/:target/rank-change',
  validate: {
    type: 'json',
    body: Joi.object({
      change: Joi.number().required()
    }),
    continueOnError: true
  },
  pre: async (ctx, next) => {
    await authenticate(ctx, next)
    await nbxAuthenticate(ctx, next)
    return next()
  },
  handler: async (ctx) => {
    if (ctx.invalid) {
      await throwError(ctx, Boom.badRequest(ctx.invalid.body))
      return
    }

    return nbx.changeRank(ctx.request.params.group, ctx.request.params.target, ctx.request.body.change).then((res) => {
      ctx.status = 200
      ctx.body = res
    }).catch((err) => {
      return throwError(ctx, Boom.badRequest(err.message))
    })
  }
})

app.use(router.middleware())

if (COOKIE) {
  nbx.setCookie(COOKIE).then((currentUser) => {
    loggedIn = true
    app.listen(PORT)
    console.log(`Listening on port ${PORT},`, `logged into ${currentUser.name}#${currentUser.id}`)
  })
} else {
  app.listen(PORT)
  console.log(`Listening on port ${PORT},`, 'not logged in.')
}
