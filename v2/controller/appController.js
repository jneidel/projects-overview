exports.renderList = async( req, res ) => {
    res.render( "main", { items: [ 
        {title: "123aslkdjflkasdlfkj", values: [ "awe", "abc", "efd" ] }, 
        {title: "asdfasdf", values: [ "awe", "abc", "efd" ] }, 
        {title: "asdfasdfsadfasdfasdf", values: [ "awe", "abc", "efd" ] }, 
        {title: "yesadfsadfsadfsadfsadfasdah", values: [ "awe", "abc", "efd" ] }, 
        {title: "Okokokokok", values: [ "awe", "abc", "efd" ] }, 
        {title: "hahahahahahahahahaha", values: [ "awe", "abc", "efd" ] } 
    ] } );
};
