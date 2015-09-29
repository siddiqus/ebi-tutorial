angular.module('ebi.services', [])

.factory('Categories', function() {
    var categories = [
      {name: 'Neuroanatomy', id: 0},
      {name: 'Psychology 101', id: 1},
      {name: 'Statistics', id: 2}
    ];

    return {
      all: function() {
        return categories;
      }
    };
})


.factory('Questions', function(){
  var choices = [
    {a: 'img/A1.bmp', b: 'img/A2.bmp', c: 'img/A3.bmp', d: 'img/A4.bmp' },
    {a: 'img/B1.bmp', b: 'img/B2.bmp', c: 'img/B3.bmp', d: 'img/B4.bmp' },
    {a: 'img/C1.bmp', b: 'img/C2.bmp', c: 'img/C3.bmp', d: 'img/C4.bmp' },
  ];

  var tests = [
    [
      // test name to pic
      {id: 0, q: 'img/B1.bmp', opts: choices[0], ans: 'a'},
      {id: 1, q: 'img/B2.bmp', opts: choices[0], ans: 'b'},
      {id: 2, q: 'img/B3.bmp', opts: choices[0], ans: 'c'},
      {id: 3, q: 'img/B4.bmp', opts: choices[0], ans: 'd'}
    ],
      // test function to pic
    [
      {id: 4, q: 'img/C1.bmp', opts: choices[0], ans: 'a'},
      {id: 5, q: 'img/C2.bmp', opts: choices[0], ans: 'b'},
      {id: 6, q: 'img/C3.bmp', opts: choices[0], ans: 'c'},
      {id: 7, q: 'img/C4.bmp', opts: choices[0], ans: 'd'}
    ],
      // test function to name
      {id: 8, q: 'img/C1.bmp', opts: choices[1], ans: 'a'},
      {id: 9, q: 'img/C2.bmp', opts: choices[1], ans: 'b'},
      {id: 10, q: 'img/C3.bmp', opts: choices[1], ans: 'c'},
      {id: 11, q: 'img/C4.bmp', opts: choices[1], ans: 'd'}
    ],
      // test name to function
    [
      {id: 12, q: 'img/B1.bmp', opts: choices[2], ans: 'a'},
      {id: 13, q: 'img/B2.bmp', opts: choices[2], ans: 'b'},
      {id: 14, q: 'img/B3.bmp', opts: choices[2], ans: 'c'},
      {id: 15, q: 'img/B4.bmp', opts: choices[2], ans: 'd'}
    ]
  ];

  var training = [
    [ // pic to name
      {id: 0, q: 'img/A1.bmp', opts: choices[1] , ans: 'a'},
      {id: 1, q: 'img/A2.bmp', opts: choices[1], ans: 'b'},
      {id: 2, q: 'img/A3.bmp', opts: choices[1], ans: 'c'},
      {id: 3, q: 'img/A4.bmp', opts: choices[1], ans: 'd'}
    ],
    [ // pic to function
      {id: 0, q: 'img/A1.bmp', opts: choices[2] , ans: 'a'},
      {id: 1, q: 'img/A2.bmp', opts: choices[2], ans: 'b'},
      {id: 2, q: 'img/A3.bmp', opts: choices[2], ans: 'c'},
      {id: 3, q: 'img/A4.bmp', opts: choices[2], ans: 'd'}
    ]
  ];

  return {
    all: function(round){
      var arr = [];
      for(var i=0; i<questions.length;i++){
        if(round === questions[i].round){
          arr.push(questions[i]);
        }
      };
      return arr;
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
