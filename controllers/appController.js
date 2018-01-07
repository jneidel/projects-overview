require( "dotenv" ).config( { path: "../variables.env" } );

exports.renderItems = async ( req, res ) => {
  res.render( "main", { title: "Project Manager" } );
};

exports.login = ( req, res ) => {
  res.render( "login", { title: "Login" } );
};

exports.register = ( req, res ) => {
  res.render( "register", { title: "Register" } );
};

exports.logout = ( req, res ) => {
  if ( req.query.unverified ) {
    req.flash( "error", "Unverified token" );
  } else {
    req.flash( "success", "You have been sucessfully logged out." );
  }

  res.render( "logout", { title: "Logout" } );
};

exports.account = ( req, res, next ) => {
  res.render( "account", { title: "Account" } );
};

exports.welcome = ( req, res ) => {
  res.render( "welcome", { title: "Project Manager" } );
};
