use project-manager
db.cards.drop();
db.cards.insertMany([
{
    _id: 1,
    userid: "jneidel",
    title: "Programming", 
    front: [ "foo", "baz", "bar", "" ], 
    back: [ "awe", "abc", "efd", "" ],
    position: 1,
},
{
    _id: 2,
    userid: "jneidel",
    title: "Reading", 
    front: [ "foo", "baz", "bar", "" ], 
    back: [ "awe", "abc", "efd", "" ],
    position: 2,
},
{
    _id: 3,
    userid: "jneidel",
    title: "Courses", 
    front: [ "foo", "baz", "bar", "" ], 
    back: [ "awe", "abc", "efd", "" ],
    position: 3,
},
{
    _id: 4,
    userid: "jneidel",
    title: "eBooks", 
    front: [ "foo", "baz", "bar", "" ], 
    back: [ "awe", "abc", "efd", "" ],
    position: 4,
},
{
	_id: 5,
	userid: "jneidel",
	title: "Audiobooks", 
    front: [ "foo", "baz", "bar", "" ], 
    back: [ "awe", "abc", "efd", "" ],
    position: 5,
}
]);
db.cards.createIndex({userid: 1});
db.cards.createIndex({position: 1});
