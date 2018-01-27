exports.app = async ( req, res ) => {
  const username = req.body.username;
  const homepage = req.homepage;
  const cards = req.cards;

  return res.render( "app", {
    title: "App",
    cards,
    username,
    homepage,
  } );
};

exports.login = ( req, res ) => {
  const username = req.body.username;
  const homepage = req.homepage;

  return res.render( "login", {
    title: "Login",
    username,
    homepage,
  } );
};

exports.register = ( req, res ) => {
  const username = req.body.username;
  const homepage = req.homepage;

  return res.render( "register", {
    title: "Register",
    username,
    homepage,
  } );
};

exports.logout = ( req, res ) => {
  req.flash( "success", "Logout successful" );

  return res.redirect( "/login" );
};

exports.account = ( req, res, next ) => {
  const username = req.body.username;
  const homepage = req.homepage;

  const data = {
    title: "Account",
    username,
    homepage,
  };

  if ( req.query && req.query.username ) {
    data.newUsername = req.query.username;
  }

  return res.render( "account", data );
};

exports.welcome = ( req, res ) => res.render( "welcome", {
  title: "Project Manager",
} );
