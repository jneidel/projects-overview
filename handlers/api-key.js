module.exports = async ( req, res, next ) => {
  /*
   * Out: set api key if available
   */
  const username = req.body.username;
  const db = req.db.users;

  const user = await db.find( { username } ).toArray();

  req.apiKey = user[0].api ? user[0].api : null;

  next();
};
