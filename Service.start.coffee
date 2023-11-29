 require 'dotenv').config()
express = require 'express'
cors = require 'cors'
bodyParser = require 'body-parser'
helmet = require 'helmet'
compression = require 'compression'
path = require 'path'
socketio = require 'socket.io'
jwt = require 'jsonwebtoken'
serviceRouter = require './routes/service.routes'
app = express()
PORT = process.env.PORT or 9000

# Excessive logging
if process.env.NODE_ENV isnt 'production'
  morgan = require 'morgan'
  app.use morgan('dev')

app.use helmet()
app.use helmet.hidePoweredBy()
app.use cors()
app.use bodyParser.json()
app.set 'trust proxy', 1

# Essential. Basically everything happens in here. And importing stuff.
app.use '/', serviceRouter
# Main course

if process.env.NODE_ENV is 'production'
  app.use compression()
  app.use express.static(path.join(__dirname, 'client/build'))

  app.get '*', (req, res) ->
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))

# Connect DB
# (async () ->
#   try
#     await mongoose.connect("mongodb+srv://myadmin:adminpass@cluster0.u6bi1ii.mongodb.net/?retryWrites=true&w=majority", {
#       useNewUrlParser: true,
#       useUnifiedTopology: true,
#       useCreateIndex: true,
#     })
#     console.log('Connected to database')
#   catch (err)
#     throw new Error(err)
# )()

# File compression middleware
app.use (err, req, res, next) ->
  console.log err.message
  if not err.statusCode
    err.statusCode = 500
  if err.name is 'MulterError'
    if err.message is 'File too large'
      return res
        .status(400)
        .send { error: 'Your file exceeds the limit of 10MB.' }
  res.status(err.statusCode or 500).send
    error:
      if err.statusCode >= 500 and not err.message
        'An unexpected error ocurred, please try again later.'
      else
        err.message

expressServer = app.listen(PORT, () ->
  console.log "•INFO Authentication service listening on http://localhost:#{PORT}/"
)

io = socketio(expressServer)
app.set 'socketio', io
console.log 'Socket.io listening for connections'

# Authenticate before establishing a socket connection

# i
io.use (socket, next) ->
  token = socket.handshake.query.token
  if token
    try
      user = jwt.decode(token, process.env.JWT_SECRET)
      if not user
        return next new Error('Not authorized.')
      socket.user = user
      return next()
    catch err
      next err
  else
    return next new Error('Not authorized.')
.on 'connection', (socket) ->
  socket.join socket.user.id
  console.log 'socket connected:', socket.id
