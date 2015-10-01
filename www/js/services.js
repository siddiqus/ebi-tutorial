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

  var questions = [
    [ // train pic to name - TRAINING - 0
      {id: 0, q: 'img/A1.bmp', opts: choices[1] , ans: 'a'},
      {id: 1, q: 'img/A2.bmp', opts: choices[1], ans: 'b'},
      {id: 2, q: 'img/A3.bmp', opts: choices[1], ans: 'c'},
      {id: 3, q: 'img/A4.bmp', opts: choices[1], ans: 'd'}
    ],
    [ // train pic to function - TRAINING - 1
      {id: 4, q: 'img/A1.bmp', opts: choices[2] , ans: 'a'},
      {id: 5, q: 'img/A2.bmp', opts: choices[2], ans: 'b'},
      {id: 6, q: 'img/A3.bmp', opts: choices[2], ans: 'c'},
      {id: 7, q: 'img/A4.bmp', opts: choices[2], ans: 'd'}
    ],
    [
      // test name to pic - test 0
      {id: 8, q: 'img/B1.bmp', opts: choices[0], ans: 'a'},
      {id: 9, q: 'img/B2.bmp', opts: choices[0], ans: 'b'},
      {id: 10, q: 'img/B3.bmp', opts: choices[0], ans: 'c'},
      {id: 11, q: 'img/B4.bmp', opts: choices[0], ans: 'd'}
    ],
    [
      // test function to pic - test 1
      {id: 12, q: 'img/C1.bmp', opts: choices[0], ans: 'a'},
      {id: 13, q: 'img/C2.bmp', opts: choices[0], ans: 'b'},
      {id: 14, q: 'img/C3.bmp', opts: choices[0], ans: 'c'},
      {id: 15, q: 'img/C4.bmp', opts: choices[0], ans: 'd'}
    ],
    [
      // test function to name - test 2
      {id: 16, q: 'img/C1.bmp', opts: choices[1], ans: 'a'},
      {id: 17, q: 'img/C2.bmp', opts: choices[1], ans: 'b'},
      {id: 18, q: 'img/C3.bmp', opts: choices[1], ans: 'c'},
      {id: 19, q: 'img/C4.bmp', opts: choices[1], ans: 'd'}
    ],
    [
      // test name to function - test 3
      {id: 20, q: 'img/B1.bmp', opts: choices[2], ans: 'a'},
      {id: 21, q: 'img/B2.bmp', opts: choices[2], ans: 'b'},
      {id: 22, q: 'img/B3.bmp', opts: choices[2], ans: 'c'},
      {id: 23, q: 'img/B4.bmp', opts: choices[2], ans: 'd'}
    ]
  ];

  return {
    training: function(round){
      return questions[round];
    },
    testing: function(qst){ // qst is an array
      tests = []
      for(var i=0;i<qst.length;i++){
        var j = qst[i] + 2;
        tests = tests.concat(questions[j]);
      }
      return tests;
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
