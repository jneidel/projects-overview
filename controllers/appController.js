require( "dotenv" ).config( { path: "../variables.env" } );

exports.app = async ( req, res ) => {
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
  const data = {
    title   : "Account",
    username: req.body.username,
    homepage: req.homepage,
  };

  if ( req.query && req.query.username ) {
    data.newUsername = req.query.username;
  }

  res.render( "account", data );
};

exports.welcome = ( req, res ) => {
  res.render( "welcome", { title: "Project Manager" } );
};
