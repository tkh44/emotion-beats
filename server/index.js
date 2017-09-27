const next = require('next')
const Hapi = require('hapi')
const Good = require('good')
// const matches = require('tmatch')
const { Search } = require('js-search')

let counter = 0
const PLACES = require('../boulder.json').places.map(item => {
  item.id = counter++
  return item
})

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const server = new Hapi.Server()

const search = new Search('name')
// tags
search.addIndex('tags')
// website
search.addIndex('website')
// phone
search.addIndex('phone')
// address
search.addIndex(['address', 'country'])
search.addIndex(['address', 'city'])
search.addIndex(['address', 'region'])
search.addIndex(['address', 'code'])
search.addIndex(['address', 'street'])
// geo
search.addIndex(['coordinates', 'latitude'])
search.addIndex(['coordinates', 'longitude'])
search.addDocuments(PLACES)

// add request logging (optional)
const pluginOptions = [
  {
    register: Good,
    options: {
      reporters: {
        console: [
          {
            module: 'good-console'
          },
          'stdout'
        ]
      }
    }
  }
]

const defaultHandlerWrapper = app => {
  const handler = app.getRequestHandler()
  return ({ raw, url }, hapiReply) =>
    handler(raw.req, raw.res, url).then(() => {
      hapiReply.close(false)
    })
}

async function main () {
  await app.prepare()
  server.connection({ port })
  await server.register(pluginOptions)

  server.route({
    path: '/api/search',
    method: 'GET',
    handler: (request, reply) => {
      if (request.query.id) {
        let found = PLACES.find(x => x.id === parseInt(request.query.id, 10))
        return reply(found)
      }

      const start = parseInt(request.query.start) || 0
      const end = parseInt(request.query.end) || 100

      let finalData = (request.query.text
        ? search.search(request.query.text)
        : PLACES).slice(start, end)
      reply(finalData)
    }
  })

  server.route({
    method: 'GET',
    path: '/{p*}' /* catch all route */,
    handler: defaultHandlerWrapper(app)
  })

  try {
    await server.start()
    console.log(`> Ready on http://localhost:${port}`)
  } catch (e) {
    console.log('Error starting server')
    console.log(e)
  }
}

main()
