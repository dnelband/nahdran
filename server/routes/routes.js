var pagesController = require('../controllers/pagesController.js');
var contentsController = require('../controllers/contentsController.js');
var galleriesController = require('../controllers/galleriesController.js');
var newsController = require('../controllers/newsController.js');
var crewController = require('../controllers/crewController.js');
var messagesController = require('../controllers/messagesController.js');
var userController = require('../controllers/userController.js');

module.exports = function (app, passport) {
  app.get('/db/pages/', pagesController.getPages);
  app.post('/db/pages/', pagesController.createPage);
  app.get('/db/pages/:link', pagesController.getPageByLink);
  app.get('/db/pagesbyid/:id', pagesController.getPageById);
  app.put('/db/pages/:id', pagesController.updatePage);
  app.delete('/db/pages/:id', pagesController.deletePage);

  app.get('/db/contents/', contentsController.getContents);
  app.post('/db/contents/', contentsController.createContents);
  app.put('/db/contents/:id', contentsController.updateContents);
  app.delete('/db/contents/:id', contentsController.deleteContents);
  app.get('/db/contentsbypage/:id', contentsController.getContentsByPageId);

  app.get('/db/galleries/', galleriesController.getGalleries);
  app.post('/db/galleries/', galleriesController.createGallery);
  app.put('/db/galleries/:id', galleriesController.updateGallery);
  app.get('/db/galleries/:id', galleriesController.getGalleryById);
  app.delete('/db/galleries/:id', galleriesController.deleteGallery);
  app.get('/db/galleryitems/', galleriesController.getGalleryItem);
  app.post('/db/galleryitems/', galleriesController.createGalleryItem);
  app.put('/db/galleryitems/:id', galleriesController.updateGalleryItem);
  app.delete('/db/galleryitems/:id', galleriesController.deleteGalleryItem);
  app.get('/db/galleryitemsbygallery/:id',galleriesController.getGalleryItemByGalleryId);

  app.get('/db/news/', newsController.getNews);
  app.post('/db/news/', newsController.createNewsItem);
  app.get('/db/news/:id', newsController.getNewsItem);
  app.put('/db/news/:id', newsController.updateNewsItem);
  app.delete('/db/news/:id', newsController.deleteNewsItem);

  app.get('/db/crew/', crewController.getCrew);
  app.post('/db/crew/', crewController.createCrewMember);
  app.get('/db/crew/:id', crewController.getCrewMember);
  app.put('/db/crew/:id', crewController.updateCrewMember);
  app.delete('/db/crew/:id', crewController.deleteCrewMember);

  app.get('/db/messages/', messagesController.getMessages);
  app.post('/db/messages/', messagesController.createMessage);
  app.get('/db/messages/:id', messagesController.getMessage);
  app.put('/db/messages/:id', messagesController.updateMessage);
  app.delete('/db/messages/:id', messagesController.deleteMessage);

  app.get('/db/user/', userController.getUser);
  app.post('/db/user/:id', userController.updateUser)

  // Login
  app.post('/db/signin/', function (req, res, next) {
    console.log('inside of the login', req.sessionID);
    // passport.authenticate with local parameter will call function that configured in passport.use(new strategyCalss)
    passport.authenticate('local-signin', function (err, user, info) {
      console.log('Inside passport.authenticate() callback');
      console.log(
        `req.session.passport: ${JSON.stringify(req.session.passport)}`
      );
      console.log(`req.user: ${JSON.stringify(req.user)}`);
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/signin');
      }
      //req.login calls passport.serialize user
      req.login(user, function (err) {
        console.log('Inside req.login() callback');
        console.log(
          `req.session.passport: ${JSON.stringify(req.session.passport)}`
        );
        console.log(`req.user: ${JSON.stringify(req.user)}`);
        if (err) {
          return next(err);
        }
        return res.redirect('/admin/');
      });
    })(req, res, next);
  });

  // Logout
  app.get('/db/signout/', function (req, res, next){
    console.log('hello im sign out');
    req.logout();
    res.redirect('/');
  });

  // function isLoggedIn(req, res, next) {
  //   if (req.isAuthenticated()){
  //       return next();
  //   } else {
  //       res.redirect('/signin');
  //   }
  // }

  // // Get Admin
  // app.get("/admin/",isLoggedIn, (req, res) => {
  //   console.log('why not res send file?"?!"?§!"?§!?§!?!?§!');
  //   res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  // });
};
