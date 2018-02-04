exports.generateExampleCards = ( username, cardId ) => {
  const data = [
    {
      title: "Books",
      front: [ "Seveneves", "Four Hour Workweek", "YDKJS", "" ],
      back : [ "Autobiography of Malcolm X", "Zero to One", "Total Recall", "Freakonomics", "Awake the Giant Within", "The Dip", "The C Programming Language", "If Hemingway Wrote JS", "Automating the Boring Stuff with Python", "" ],
    },
    {
      title: "Programming",
      front: [ "FCC Frontend", "Markdown Previewer", "CS50", "" ],
      back : [ "Intro to React", "Personal Site", "" ],
    },
    {
      title: "Comics/Manga",
      front: [ "Attack on Titan", "One Punch Man", "The Walking Dead", "" ],
      back : [ "Fables", "Black Butler", "Bakuman", "Deadman Wonderland", "" ],
    },
    {
      title: "Movies/Series",
      front: [ "Dark", "The Office", "" ],
      back : [ "Inglourious Basterds", "Parks and Rec", "Arrested Development", "" ],
    },
  ];
  const result = [];

  for ( let i = 0; i < data.length; i++ ) {
    data[i].username = username;
    data[i]._id = cardId + i;
    data[i].position = i + 1;

    result.push( data[i] );
  }

  return result;
};
