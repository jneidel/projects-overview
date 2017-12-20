use project-manager
db.cards.drop();
db.cards.insertMany([
{
    _id: 1,
    username: "jneidel",
    title: "Programming", 
    front: [ "foo", "baz", "bar", "" ], 
    back: [ "awe", "abc", "efd", "" ],
    position: 1,
},
{
    _id: 2,
    username: "jneidel",
    title: "Reading", 
    front: [ "foo", "baz", "bar", "" ], 
    back: [ "awe", "abc", "efd", "" ],
    position: 2,
},
{
    _id: 3,
    username: "jneidel",
    title: "Courses", 
    front: [ "foo", "baz", "bar", "" ], 
    back: [ "awe", "abc", "efd", "" ],
    position: 3,
},
{
    _id: 4,
    username: "jneidel",
    title: "eBooks", 
    front: [ "foo", "baz", "bar", "" ], 
    back: [ "awe", "abc", "efd", "" ],
    position: 4,
},
{
	_id: 5,
	username: "jneidel",
	title: "Audiobooks", 
    front: [ "foo", "baz", "bar", "" ], 
    back: [ "awe", "abc", "efd", "" ],
    position: 5,
}
]);
db.users.drop();
db.users.insertOne(
	{
		username: "jneidel",
		password: "202cb962ac59075b964b07152d234b70",
		logins: [],
		settings: {},
	}
);
db.cards.createIndex({username: 1});
db.cards.createIndex({position: 1});
db.users.createIndex({username: 1});
