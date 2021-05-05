var db = require('../database/db');
var path = require('path');
const { url } = require('inspector');

var pagesController = require('../controllers/pagesController.js');
var contentsController = require('../controllers/contentsController.js');
var galleriesController = require('../controllers/galleriesController.js');
var newsController = require('../controllers/newsController.js');
var crewController = require('../controllers/crewController.js');

module.exports = function(app,passport) {
    
    app.get('/db/pages/', pagesController.getPages)
    app.post('/db/pages/',pagesController.createPage)
    app.get('/db/pages/:link', pagesController.getPageByLink)
    app.get('/db/pagesbyid/:id', pagesController.getPageById)
    app.put('/db/pages/:id',pagesController.updatePage)
    app.delete('/db/pages/:id',pagesController.deletePage)

    app.get('/db/contents/', contentsController.getContents)
    app.post('/db/contents/', contentsController.createContents)
    app.put('/db/contents/:id', contentsController.updateContents)
    app.delete('/db/contents/:id', contentsController.deleteContents)
    app.get('/db/contentsbypage/:id', contentsController.getContentsByPageId)

    app.get('/db/galleries/', galleriesController.getGalleries)
    app.post('/db/galleries/', galleriesController.createGallery)
    app.put('/db/galleries/:id', galleriesController.updateGallery)
    app.get('/db/galleries/:id', galleriesController.getGalleryById)
    app.delete('/db/galleries/:id', galleriesController.deleteGallery)
    app.get('/db/galleryitems/', galleriesController.getGalleryItem)
    app.post('/db/galleryitems/', galleriesController.createGalleryItem)
    app.put('/db/galleryitems/:id', galleriesController.updateGalleryItem)
    app.delete('/db/galleryitems/:id', galleriesController.deleteGalleryItem)
    app.get('/db/galleryitemsbygallery/:id', galleriesController.getGalleryItemByGalleryId)

    app.get('/db/newsitems', newsController.getNews)
    app.get('/db/crewmembers', crewController.getCrew)
    
    // Login
    app.post('/db/signin', function(req, res, next) {
        console.log("inside of the login",req.sessionID)
        // passport.authenticate with local parameter will call function that configured in passport.use(new strategyCalss)
        passport.authenticate('local-signin', function(err, user, info) {
            console.log('Inside passport.authenticate() callback');
            console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
            console.log(`req.user: ${JSON.stringify(req.user)}`)
            if (err) { return next(err); }
            if (!user) { return res.redirect('/signin'); }
            //req.login calls passport.serialize user
            req.login(user, function(err) {
            console.log('Inside req.login() callback')
            console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
            console.log(`req.user: ${JSON.stringify(req.user)}`)
            if (err) { return next(err); }
            return res.redirect('/admin');
            });
        })(req, res, next);
    });
  
      // IsLoggedIn
      function isLoggedIn(req, res, next) {
        console.log('isLoggedIn?')
        console.log(req.isAuthenticated());
        if (req.isAuthenticated()){ 
            console.log('not authenticated')
            return next();
        } else {
            res.redirect('/signin');
        }
      }
  
      // Get Admin
      app.get('/admin',isLoggedIn, (req, res) => {
          console.log('hello');
        res.sendFile(path.join(__dirname, '../../build', 'index.html'));
      });

}
