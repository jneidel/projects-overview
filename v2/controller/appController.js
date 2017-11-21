exports.renderList = async( req, res ) => {
    res.render( "main", { items: [ 
        {title: "yesadfsadfsadfsadfsadfasdah", values: [ "awe", "abc", "efd" ] }, 
        {title: "yesadfsadfsadfsadfsadfasdah", values: [ "awe", "abc", "efd" ] }, 
        {title: "yesadfsadfsadfsadfsadfasdah", values: [ "awe", "abc", "efd" ] }, 
        {title: "yesadfsadfsadfsadfsadfasdah", values: [ "awe", "abc", "efd" ] }, 
        {title: "yesadfsadfsadfsadfsadfasdah", values: [ "awe", "abc", "efd" ] }, 
        {title: "yesadfsadfsadfsadfsadfasdah", values: [ "awe", "abc", "efd" ] } 
    ] } );
};
