const router = require("express").Router();

//to prevent from user to directly type ‘/profile’ in the URL.

const loginCheck = () => {
  
}

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', (req, res, next) => {
  // don't understand the whole cookie part.
  res.cookie('myCookie', 'hello server')
  const loggedInUser = req.session.user
  res.render('profile', {user: loggedInUser})
})
module.exports = router;
