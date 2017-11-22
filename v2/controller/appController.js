exports.renderItems = async( req, res ) => {
    res.render( "main", { cards: [
        { title: "Programming", frontItems: [ "foo", "baz", "bar" ], backItems: [ "awe", "abc", "efd" ] },
        { title: "Reading", frontItems: [ "foo", "baz", "bar" ], backItems: [ "awe", "abc", "efd" ] },
        { title: "Courses", frontItems: [ "foo", "baz", "bar" ], backItems: [ "awe", "abc", "efd" ] },
        { title: "eBooks", frontItems: [ "foo", "baz", "bar" ], backItems: [ "awe", "abc", "efd" ] },
        { title: "Audiobooks", frontItems: [ "foo", "baz", "bar" ], backItems: [ "awe", "abc", "efd" ] },
        { title: "Misc", frontItems: [ "foo", "baz", "bar" ], backItems: [ "awe", "abc", "efd" ] },
    ] } );
};

exports.updateDatabase = async( req, res ) => {
    console.log( req.query );
    res.sendStatus( 200 );
};
