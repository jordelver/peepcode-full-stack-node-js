Pie = require '../../models/pie'

routes = (app) ->
  app.namespace '/admin', ->

    app.all '/*', (req, res, next) ->
      if not (req.session.currentUser)
        req.flash 'error', 'Please login.'
        res.redirect '/login'
        return
      next()

    app.namespace '/pies', ->
      app.get '/', (req, res) ->
        pie = new Pie {}
        res.render "#{__dirname}/views/pies/all",
          title: "View All Pies",
          stylesheet: 'admin',
          pie: pie

      app.post '/', (req, res) ->
        attributes =
          name: req.body.name
          type: req.body.type
        pie = new Pie attributes
        pie.save (err, pie) ->
          req.flash 'info', "Pie #{pie.name} was saved."
          res.redirect '/admin/pies'

module.exports = routes
