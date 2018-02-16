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

  return res.redirect( "login" );
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

exports.welcome = ( req, res ) => {
  const username = req.body.username;
  const homepage = req.homepage;

  return res.render( "welcome", {
    title: "Project Manager",
    username,
    homepage,
  } );
};

exports.help = ( req, res ) => {
  const username = req.body.username;
  const homepage = req.homepage;

  return res.render( "help", {
    title: "Help",
    username,
    homepage,
    card : {
      title: "Books",
      front: [ "Seveneves", "Four Hour Workweek", "YDKJS", "" ],
      back : [ "Autobiography of Malcolm X", "Zero to One", "Total Recall", "Freakonomics", "Awake the Giant Within", "The Dip", "The C Programming Language", "If Hemingway Wrote JS", "Automating the Boring Stuff with Python", "" ],
    },
  } );
};
