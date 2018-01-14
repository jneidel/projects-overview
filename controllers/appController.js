require( "dotenv" ).config( { path: "../variables.env" } );

exports.renderItems = async ( req, res ) => {
  res.render( "main", {
    title   : "App",
    cards   : req.cards,
    username: req.body.username,
    homepage: "app",
  } );
};

exports.login = ( req, res ) => {
  res.render( "login", { title: "Login" } );
};

exports.register = ( req, res ) => {
  res.render( "register", { title: "Register" } );
};

exports.logout = ( req, res ) => {
  eq.flash( "success", "You have been sucessfully logged out." );

  res.render( "logout", { title: "Logout" } );
};

exports.account = ( req, res, next ) => {
  res.render( "account", { title: "Account" } );
};

exports.welcome = ( req, res ) => {
  res.render( "welcome", { title: "Project Manager" } );
};
