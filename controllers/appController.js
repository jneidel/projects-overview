require( "dotenv" ).config( { path: "../variables.env" } );

exports.renderApp = async ( req, res ) => {
  res.render( "app", {
    title   : "App",
    cards   : req.cards,
    username: req.body.username,
    homepage: req.homepage,
  } );
};

exports.login = ( req, res ) => {
  res.render( "login", {
    title   : "Login",
    username: req.body.username,
    homepage: req.homepage,
  } );
};

exports.register = ( req, res ) => {
  res.render( "register", {
    title   : "Register",
    username: req.body.username,
    homepage: req.homepage,
  } );
};

exports.logout = ( req, res ) => {
  req.flash( "success", "You have been sucessfully logged out." );

  res.redirect( "/login" );
};

exports.account = ( req, res, next ) => {
  res.render( "account", {
    title   : "Account",
    username: req.body.username,
    homepage: req.homepage,
  } );
};

exports.welcome = ( req, res ) => {
  res.render( "welcome", { title: "Project Manager" } );
};
