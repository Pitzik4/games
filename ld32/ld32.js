"use strict";

createjs.Sound.alternateExtensions = ['ogg', 'mp3'];
createjs.Sound.registerSounds([
  {src: 'blip.wav', id: 'blip'},
  {src: 'rustle.wav', id: 'rustle'},
  {src: 'switch.wav', id: 'switch'},
  {src: 'close.wav', id: 'close'},
  {src: 'buzz.wav', id: 'buzz'},
  {src: 'zap.wav', id: 'zap'},
  {src: 'smash.wav', id: 'smash'}
], 'snd/');

var acceleration = 1;
var spaceAcceleration = 10;

var gameWidth = 1000;
var gameHeight = 600;

var choices = {a: {selected: 0, length: 0, callbacks: []},
               b: {selected: 0, length: 0, callbacks: []}};

var path = {};
var itemSets = {};
var timeouts = {};

var phoneAway = {a: 'rotate(50deg) translate(225px,450px)', b: 'scaleX(-1) rotate(50deg) translate(300px,600px) scaleX(-1)'};

$(window).resize(function() {
  var aspect = gameWidth / gameHeight;
  var width = window.innerWidth, height = window.innerHeight;
  var w = height * aspect, h;
  if(w > width) {
    w = width; h = width / aspect;
  } else h = height;
  $('#game').css('transform', 'translate('+(width-gameWidth)*0.5+'px,'+(height-gameHeight)*0.5+'px) '+
    'scale('+w/gameWidth+','+h/gameHeight+')');
});

$(document).ready(function() {
  $('.flip').css('transform', 'scaleX(-1)');
  $('#a .phonec').css('transform', phoneAway.a);
  $('#b .phonec').css('transform', phoneAway.b);
  $('#a .phones, #b .phones')
    .append($('<div class="header">Instantaneous Messenger</div>'))
    .append(
      $('<div class="footer"><div class="lb"></div><div class="textboxc"><div class="textbox"></div></div><div class="rb"></div></div>'));
  $('#b .phones .header').text('Instantiated Messenger')
  $('.lb').append($('<div class="lb-arrow"></div>'));
  $('.rb').append($('<div class="rb-arrow"></div>'));
  $('.lb').click(function() {
    var phone = whatPhone($(this));
    var choice = choices[phone];
    selectChoice(phone, (choices[phone].selected-1+choice.length)%choice.length);
  });
  $('.rb').click(function() {
    var phone = whatPhone($(this));
    var choice = choices[phone];
    selectChoice(whatPhone($(this)), (choice.selected+1)%choice.length);
  });
  $('.textboxc').click(function() {
    var phone = whatPhone($(this));
    chooseChoice(phone, choices[phone].selected);
  });
  if(spaceAcceleration && spaceAcceleration != 1) {
    $(window).keydown(function(event) {
      if(event.which == 32)
        acceleration = spaceAcceleration;
    });
    $(window).keyup(function(event) {
      if(event.which == 32)
        acceleration = 1;
    });
  }
  setBG('room1', 'turned-off');
  setBG('room2', 'turned-off');
  $("#startbutton").click(startGame);
  $(window).resize();
});
function startGame() {
  $("#title").animate({transform: 'translate(-200px, 600px) rotate(-15deg) scale(0.25, 0.125)'}, 1000, function() {
    $(this).remove();
  });
  path.rude = 0;
  path.guyLocation = 'boiler-room';
  path.zachLocation = 'warehouse';
  var dialogueB1 = [], dialogueA2 = [], dialoguerA2 = dialogue(dialogueA2, 'a2');
  var breakChoices, breakCallbacks;
  doDialogue([
    2500,
    "AN: hey",
    1000,
    "AN: hey are you there",
    1000,
    "AN: plz anser i need help!",
    function(){grabPhone('a');},
    1000,
    "AN: hello!",
    2000,
    "AN: oh god does the security here not get texts",
    1000,
    "AN: i dont want to have to call",
    200,
    {ph:'a', ch: [
        "Don't worry, we do.",
        "Hold your horses, I'm here.",
        "You misspelled \"answer\".",
        "This is Pizza Place. Pickup or delivery?"
      ], cb: [
        [
          "AP: Calm down. We get texts.",
          1500,
          "AP: What's the matter?",
          1500,
          "AN: thank god",
          1000
        ],
        [
          "AP: Hold your horses!",
          function() { ++path.rude; },
          1500,
          "AP: Not everyone's fingers are as fast as yours.",
          1500,
          "AP: Wait a bit before jumping to conclusions next time.",
          1500,
          "AN: ok! sorry!",
          1000,
          "AN: but listen ok",
          1000
        ],
        [
          "AP: You misspelled \"answer\".",
          function() { ++path.rude; },
          4000,
          "AN: what",
          1500,
          "AP: You wrote \"anser\". There's a W.",
          3000,
          "AN: who is this",
          1500,
          "AP: Grammar security. Who did you think?",
          1500,
          "AN: thats not grammar due",
          1000,
          "AN: dude*",
          1500,
          "AN: its spelling",
          1500,
          "AP: Whoops! Busted.",
          1500,
          "AP: Yeah, this is security. What's up?",
          function() { ++path.rude; },
          1500,
          "AN: prick.",
          1000,
          "AN: but whatever i really need your help",
          1000
        ],
        [
          "AP: This is Pizza Place. Pickup or delivery?",
          1500,
          "AN: nooo",
          1000,
          "AN: wrong number",
          2000,
          "AN: (i didnt know pizza place took orders by texting tho)",
          5000,
          function() { ++path.rude; },
          "AN: wait this is the right number",
          1500,
          "AP: Yes, it is.",
          1000,
          "AP: If you want pizza, that is.",
          1500,
          "AN: dude shut up",
          1000,
          "AN: this isnt funny im being chased",
          1500,
          "AP: Oh? Now you have my attention.",
          function() { ++path.rude; },
          1500
        ]
      ]
    },
    500,
    "AN: theres this guy",
    1000,
    "AN: hes chasing me thru the building",
    1500,
    "AP: What room are you in?",
    1500,
    "AN: boiler room",
    2500,
    function() {
      createjs.Sound.play('switch');
    },
    180,
    {room: 'room1', img: 'boiler-room'},
    {room: 'room1', item: 'guy', img: 'guy-hunch', x: 155.354, y: 45.204},
    populateBoilerRoom,
    300,
    {room: 'room1', img: 'turned-off'},
    roomClearing('room1'),
    750,
    {room: 'room1', img: 'boiler-room'},
    {room: 'room1', item: 'guy', img: 'guy-hunch', x: 155.354, y: 45.204},
    populateBoilerRoom,
    1500,
    "AP: Alright, I see you.",
    500,
    "BN: Hi! Hows it going?",
    1000,
    "AP: Huh? Hang on, I'm getting another text...",
    function() { ++path.rude; },
    1500,
    "AN: what!!",
    1000,
    "AN: youv gott abe kidding",
    1000,
    "AN: THIS IS IMPORTANT",
    1500,
    "AP: Don't worry. I'll answer on my other phone.",
    750,
    dialogue(dialogueB1, 'b1'),
    function() { grabPhone('b'); },
    750,
    "AN: what",
    2000,
    "AN: how does that even",
    2000,
    "AN: i mean like",
    2000,
    "AN: how did you set that up",
    function() {
      setTimeout(function() {
        doDialogue([
          {ph:'a',ch:[
              "Shut up!",
              "Sorry."
            ],
            cb:[
              [
                function() { stopLine('a1'); },
                "AP: Would you kindly SHUT UP?",
                function() { ++path.rude; },
                2000,
                "AP: I'm trying to talk to my friend here!",
                function() { ++path.rude; },
                2500,
                "AN: and im trying to not get killed!",
                1500,
                "AN: are you stupid or what!",
                2500,
                "AP: Please. How do you know he's out for blood?",
                function() { ++path.rude; },
                2000,
                "AP: Does he even have a weapon?",
                2000,
                "AN: no.",
                2000,
                "AN: but he said he was going to kill me!",
                function() { path.killer = true; },
                2000,
                "AN: and i took his word for it!",
                2000,
                "AN: now do your job moron!",
                3000,
                "AN: ...",
                2000,
                dialoguerA2
              ],
              [
                function() { stopLine('a1'); },
                "AP: Look, I'm sorry for wasting your time.",
                2000,
                "AP: But I have to answer this.",
                2000,
                "AN: if its so imporant why is he TEXTING you",
                1500,
                "AN: shouldnt he call",
                1500,
                "AN: riddle me that mr smarty pants",
                2000,
                "AP: Maybe for the same reason you chose to text.",
                2000,
                "AN: no",
                1000,
                "AN: because MY reason",
                1500,
                "AN: is because im being chased by a psycho!",
                2000,
                "AN: i dont want him to hear me!",
                2000,
                dialoguerA2
              ]
            ]
          }
        ], 'a2');
      }, 250);
    },
    2000,
    "AN: do you have 2 phone #s?",
    5000,
    "AN: helloooooo",
    4000,
    "AN: come on",
    6000,
    function() { ++path.rude; clearChoices('a'); },
    dialoguerA2
  ], 'a1');
  dialogueA2.push(
    "AN: look man ok?",
    1000,
    "AN: this is serious",
    1500,
    "AN: all im asking is",
    1500,
    "AN: send someone here to help me",
    1500,
    "AN: i know youre not the police",
    1500,
    "AN: but youre the closest thing we have these days",
    function() { path.noPolice = true; },
    2500,
    "AN: so just",
    1500,
    "AN: please",
    1500,
    "AN: do your job",
    250,
    {ph:'a',ch:[
        "Alright. (Lie)",
        "Alright.",
        "The police aren't gone."
      ],cb:[
        [
        ],
        [
          function() { path.helpComing = true; }
        ],
        [
          "AP: Actually, the police are still around.",
          3000,
          "AN: bs",
          1500,
          "AN: i mean hello? the govt collapsed",
          2000,
          "AN: all the f ing countries did",
          2000,
          "AN: thanks to meyer f ing inc",
          2000,
          "AN: how could they run a police force?",
          250,
          {ph:'a',ch:[
              "You're right. (Lie)",
              "You're wrong."
            ],cb:[
              [
                "AP: You're right.",
                2500,
                "AP: I don't know what I was thinking.",
                2000,
                "AN: yeah",
                2000,
                "AN: so in leu of police",
                2000,
                "AN: could you send me some help now for god sake?",
                250,
                {ph:'a', ch:[
                    "Alright. (Lie)",
                    "Alright."
                  ],cb:[
                    [
                    ],
                    [
                      function() { path.helpComing = true; }
                    ]
                  ]
                }
              ],
              [
                "AP: Ha ha ha!",
                2000,
                "AP: That is actually funny to read.",
                2000,
                "AN: yeah i dont get the joke",
                2000,
                "AN: clue me in please",
                2000,
                "AN: whats so funny about the f ing corprate apocalypse??",
                2500,
                "AP: That it never happened.",
                2000,
                "AP: Meyer, Inc is a camping gear manufacturer!",
                2500,
                "AP: How could it take over the, ahem, \"f ing\" world?",
                2500,
                "AN: you tell me!",
                2000,
                "AN: youre the lucky jerk who works for them",
                2500,
                "AP: Look, try calling 911.",
                2000,
                "AP: They'll help you. It's their job.",
                2000,
                "AN: are you serious",
                3500,
                "AN: well fine",
                2000,
                "AN: but theres no way this will work",
                2500,
                "AP: We'll see.",
                2000,
                itemRemoval('guy'),
                {room: 'room1', item: 'guy', img: 'guy-call', x: 162.694, y: 45.204},
                function() {
                  path.helpComing = true;
                  path.police = true;
                  injectChoices('b', ["I told him to call the police."], [function() {
                    if(!path.zachMurder) {
                      for(var l in timeouts) {
                        if(l[0] == 'b') stopLine(l);
                      }
                      doDialogue([
                        "BP: I told him to call the police.",
                        function() { path.zachHostile = true; },
                        2000,
                        itemRemoval('zach'),
                        {switchOn: function() { return path.zachLocation; },
                        'warehouse': [{room: 'room2', item: 'zach', img: 'zach-mad', x: 296.037, y: 48.448}]
                        },
                        2000,
                        "BN: You did what",
                        2000,
                        "BP: You heard me.",
                        3000,
                        "BN: Why",
                        1500,
                        "BN: Did you do that",
                        2000,
                        "BP: Killing people isn't right, Zach.",
                        function() { path.killer = true; },
                        2000,
                        "BP: Even alternate-universe doppelgangers.",
                        function() { path.multiverse = true; path.guyIdentity = true; },
                        3000,
                        "BN: Fine",
                        2000,
                        "BN: The police will be here in ten minutes",
                        2500,
                        "BN: I give you",
                        1500,
                        "BN: Twenty seconds",
                        1000,
                        "BP: Huh?",
                        250,
                        zachMurder,
                        undefined
                      ], 'bpolice');
                    }
                  }]);
                },
                undefined
              ]
            ]
          }
        ]
      ]
    },
    "AP: Alright. Help is on its way.",
    1500,
    "AN: oh my god finally!!",
    1500,
    "AN: thanks",
    1500,
    "AN: how long til they get here?",
    2000,
    "AP: It will be a while.",
    {check: function() { return path.helpComing; }, ifNot: [
      2000,
      "AP: Quite a while."
    ]},
    2000,
    "AN: oh well thats just",
    1500,
    "AN: gosh that helps SO MUCH",
    1000,
    "AN: this guys crazy fast man",
    1000,
    "AN: hes going to find me!!",
    250,
    {ph: 'a', ch: [
        "You need a weapon.",
        "What a shame."
      ], cb: [
        [
          "AP: Calm down!",
          1500,
          "AP: You just need to find a weapon.",
          2000,
          "AN: a weapon?",
          1000,
          "AN: i cant take this guy on!",
          2000,
          "AP: You don't have a choice.",
          1500,
          "AN: ok! a weapon!",
          2000,
          "AN: i dont see any weapons here!",
          1500,
          "AN: oh god what am i even thinking",
          1500,
          "AN: of course there arent any weapons its meyer inc!",
          2000,
          "AP: Calm. Down.",
          2000,
          "AP: There are things here you can use as weapons.",
          2500,
          "AN: like what?",
          1000,
          "AP: (Click on a potential weapon to suggest it to him.)",
          {set: 'guyweps',
            'lighter': [
              itemSetClearing('guyweps'),
              "AP: That lighter.",
              1500,
              "AN: lighter? what lighter?",
              2000,
              "AP: By the boiler.",
              1500,
              "AP: That would make a good weapon, I think.",
              2000,
              itemRemoval('lighter'),
              function() { path.guyWeapon = 'lighter'; },
              2000,
              "AN: you do?",
              1500,
              "AN: the flame is tiny",
              1500,
              "AP: But it still hurts.",
              1500,
              "AP: It's like a tazer.",
              2000,
              "AN: yeah, not really",
              1500,
              "AN: better than nothing i guess"
            ],
            'stove': [
              itemSetClearing('guyweps'),
              "AP: Take the camp stove.",
              1500,
              "AP: It's on a box on the other side of the boiler.",
              2500,
              itemRemoval('stove'),
              function() { path.guyWeapon = 'stove'; },
              1000,
              "AN: its hefty",
              1500,
              "AN: but god just",
              1500,
              "AN: i cant use this thing",
              1000,
              "AN: im not strong enough!",
              1000,
              "AP: Try to use it!",
              1500,
              {check: function() { return path.zachWeapon; }, ifNot: [
                "AP: He doesn't have a weapon.",
                1500,
                "AP: Not yet, anyway.",
                1500,
                "AP: You've still got the upper hand.",
                1500,
              ]},
              "AN: well... ok..."
            ]
          },
          1500,
          "AN: so what now?",
          1500,
          "AN: do i just",
          1500,
          "AN: wait for him?",
          1500,
          "AP: It's all you can do.",
          1500,
          "AP: Good luck.",
          3000,
          "AN: thanks"
        ],
        [
          "AP: Well, I did all I could.",
          2000,
          "AN: oh! well then good for you!",
          1500,
          "AN: but what about me!",
          1500,
          "AN: what am i supposed to do!!",
          2000,
          "AP: Run.",
          1500,
          "AN: this is a dead end!",
          1500,
          "AN: theres nowhere to run!",
          1500,
          "AN: please tell me theres something i can do!",
          250,
          function() {
            turnOffPhone('a');
          },
          750,
          function() { putAwayPhone('a'); },
          undefined
        ]
      ]
    }
  );
  var wontHelp = [];
  dialogueB1.push(
    2000,
    "BP: Oh! Hey, there, Zach.",
    1500,
    "BP: I'm kind of busy right now.",
    1500,
    "BN: Oh. Well could you just help me real quick?",
    1500,
    "BP: With what?",
    1500,
    "BN: Well Im chasing this guy.",
    2500,
    {ph:'b',ch:[
        "Where?",
        "Why?"
      ],cb:[
        [
          "BP: Out of curiosity...",
          1500,
          "BP: Where is this happening?",
          1500,
          "BN: Well thats why I called!",
          1500,
          "BP: Texted.",
          1000,
          "BN: Yeah.",
          1000,
          "BN: Its in the building where you work!",
          1500,
          "BN: I know you do security.",
          1500,
          "BN: So I thought you could help me!",
          1500,
          "BN: Im in that warehouse ish room.",
          3000,
          "BN: You there?",
          1500,
          "BP: Yeah, yeah.",
          750,
          function() {
            createjs.Sound.play('switch');
          },
          180,
          {room: 'room2', img: 'warehouse'},
          {room: 'room2', item: 'zach', img: 'zach-casual', x: 294.144, y: 47.699},
          populateWarehouse,
          1500,
          "BP: Alright, I see you.",
          1500,
          "BN: Right on.",
          1500,
          "BN: And what about the guy I'm after?"
        ],
        [
          function() { path.why = true; },
          "BP: If you don't mind my asking, Zach...",
          1500,
          "BP: Why, exactly, are you chasing a guy?",
          1500,
          "BN: Aw, cmon. You know why.",
          2500,
          "BP: Yes.",
          2000,
          "BP: I suppose I do.",
          2000,
          "BN: All my other friends help me out with this stuff.",
          1500,
          "BN: So do me a favor? Im in the warehouse ish room.",
          2500,
          function() {
            createjs.Sound.play('switch');
          },
          180,
          {room: 'room2', img: 'warehouse'},
          {room: 'room2', item: 'zach', img: 'zach-casual', x: 294.144, y: 47.699},
          populateWarehouse,
          1500,
          "BP: I see you.",
          2500,
          "BP: You're lucky you're friends with so many security personnel.",
          3000,
          "BN: Lucky? PSHHH",
          1500,
          "BN: PSH\u200BH\u200BH\u200BH\u200BH\u200BH\u200BH\u200BH\u200BH\u200BH\u200BH"+
          "\u200BH\u200BH\u200BH\u200BH\u200BH\u200BH\u200BH\u200BH\u200BH\u200BH\u200BH\u200BH",
          2500,
          "BN: Pros like me dont need LUCK.",
          1500,
          "BN: We got SKILL.",
          1500,
          "BN: B)",
          1500,
          "BN: Anyway, about that guy I'm after."
        ]
      ]
    },
    1500,
    "BN: You know where he is?",
    2500,
    "BN: Blue shirt.",
    1500,
    "BN: Bald like me.",
    1500,
    "BN: Same phone as me.",
    1500,
    "BN: Basically me in a blue shirt.",
    250,
    {ph:'b',ch:breakChoices=[
        "He's in the break room. (Lie)",
        "He's in the boiler room.",
        "No, I haven't seen him. (Lie)",
        "Sorry, but I'm not going to help you."
      ],cb:breakCallbacks=[
        [
          "BP: Yeah, I've seen him.",
          2500,
          "BP: He's in the break room.",
          function() { path.zachThinks = 'break-room'; },
          2000,
          "BN: Gosh.",
          1500,
          "BN: All the way across the building?",
          2000,
          "BN: Well alright. Thanks!"
        ],
        [
          "BP: Yeah, I've seen him.",
          1500,
          "BP: He's in the boiler room.",
          function() { path.zachThinks = 'boiler-room'; },
          2000,
          "BN: Sweet! Thanks."
        ],
        [
          "BP: No, I don't know where he is.",
          function() { path.refused = true; path.zachHostile = true; },
          2000,
          "BN: You dont?",
          2000,
          "BN: Your sure? You chekced all the screens?",
          1000,
          "BN: checked",
          2500,
          "BP: Yes, all of them.",
          1500,
          "BP: No dice. Sorry.",
          2500,
          itemRemoval('zach'),
          {room: 'room2', item: 'zach', img: 'zach-mad', x: 296.037, y: 48.448},
          1000,
          "BN: Look :)",
          1500,
          "BN: Im sorry if you arent comfortable with this business :) Ok?",
          2000,
          "BN: I understand :)",
          2000,
          "BN: But",
          1500,
          "BN: Dont lie to me about it :(",
          1500,
          "BN: Were supposed to be friends :(",
          1500,
          "BN: Now",
          1500,
          "BN: Hes in the building",
          1500,
          "BN: I know you can see him",
          1500,
          "BN: Do you think you could tell me where he is?",
          250,
          {ph:'b',ch:[
              "No.",
              "I really don't know. (Lie)",
              "He's in the boiler room.",
              "He's in the break room. (Lie)"
            ],cb:[
              wontHelp,
              [
                "BP: Sorry, but that's not true.",
                1500,
                "BP: He must have left.",
                2500,
                "BN: You know",
                2000,
                "BN: You may have good grammar",
                2000,
                "BN: But",
                3000,
                "BN: You never were very smart",
                2000,
                "BP: Huh?",
                500,
                zachMurder,
                undefined
              ],
              [
                "BP: Alright.",
                1500,
                "BP: He's in the boiler room.",
                function() { path.refused = false; path.zachHostile = false; path.zachThinks = 'boiler-room' },
                2000,
                itemRemoval('zach'),
                {room: 'room2', item: 'zach', img: 'zach-casual', x: 294.144, y: 47.699},
                2000,
                "BN: Alright. Thanks buddy!",
                1500,
                "BP: Heh heh... No problem..."
              ],
              [
                "BP: Alright...",
                1500,
                "BP: He's in the break room.",
                3000,
                "BN: The break room huh",
                2000,
                "BP: Yes.",
                1500,
                "BN: All the way",
                1500,
                "BN: On the other side of the building",
                1500,
                "BP: Yes, Zach. I can see him right now.",
                2500,
                "BN: Theres a saying",
                2000,
                "BN: Fool me once shame on you",
                1500,
                "BN: Fool me twice shame on me",
                2000,
                "BN: I may not have been fooled once yet",
                2000,
                "BN: But I think it still applies ;)",
                2000,
                "BP: I'm not fooling you.",
                1500,
                "BP: I'm telling the truth this time.",
                2000,
                "BN: But the break room",
                1500,
                "BN: Its the farthest room in the building which",
                2000,
                "BN: Wouldnt be a problem for me but",
                2000,
                "BN: You didnt know that",
                2000,
                "BP: That's where he is.",
                1500,
                "BN: You tried to stall me",
                2500,
                "BP: Why wouldn't he try to hide far away from you?",
                2000,
                "BN: Because",
                2000,
                "BN: He doesnt know where I am",
                2000,
                "BN: And now",
                zachMurder,
                3000,
                "BN: Neither do you",
                undefined
              ]
            ]
          }
        ],
        appended(wontHelp, [
          "BP: I'm sorry. I know what's at stake.",
          1500,
          "BP: But I'm not going to help you kill this guy.",
          function() { path.killer = true; path.refused = true; path.zachHostile = true; },
          2000,
          itemRemoval('zach'),
          {room: 'room2', item: 'zach', img: 'zach-mad', x: 296.037, y: 48.448},
          3000,
          "BN: Oh :)",
          3000,
          "BN: Well :)",
          2000,
          "BN: That's fine",
          3000,
          "BN: :)",
          250,
          {ph:'b',ch:[
              "No, wait, never mind. I will help.",
              "Sorry, Zach."
            ],cb:[
              [
                "BP: No, wait. No no no no.",
                1500,
                "BP: I changed my mind. I'll help you.",
                function() { path.refused = false; },
                2500,
                "BN: No no :)",
                2500,
                "BN: I dont mean to intimidate :)",
                2500,
                "BN: Please",
                2500,
                "BN: :)",
                2500,
                "BN: Dont do anything you arent comfortable with :)",
                2500,
                "BN: The integrity of the multiverse may be at stake",
                function() { path.multiverse = true; },
                2500,
                "BN: But :)",
                2500,
                "BN: I can handle that on my own :)",
                2500,
                "BN: Without your help :))",
                1500,
                "BP: No, really! It's fine.",
                1500,
                "BP: I'm feeling much better about this now.",
                1500,
                "BP: Let's go kill an alternate-universe duplicate!",
                function() { path.guyIdentity = true; },
                3000,
                "BN: Please my friend :)",
                2500,
                "BN: Relax ;)",
                2500,
                "BN: I understand how you feel :)",
                2500,
                "BN: I understand",
                2500,
                "BN: All too well",
                2000,
                zachMurder,
                undefined
              ],
              [
                "BP: Sorry, Zach.",
                2000,
                "BN: Dont worry about it :)",
                2000,
                "BN: Ill just take matters into my own hands",
                2000,
                zachMurder,
                3000,
                "BP: Huh?",
                undefined
              ]
            ]
          }
        ])
      ]
    },
    2000,
    "BN: Alright so.",
    1500,
    "BN: I guess I need a weapon to take em out with.",
    2000,
    "BN: You can see both rooms right?",
    2000,
    "BN: What do you think?",
    2000,
    "BP: What do you mean?",
    2000,
    "BN: I mean click on a weapon in this room.",
    2000,
    "BN: Thatll be the one I use.",
    2000,
    "BP: Oh... You want me to choose?",
    2500,
    "BP: Okay, well... Hmm...",
    1000,
    "BP: (Click on a potential weapon.)",
    250,
    {set: 'zachweps',
      'zach': [
        itemSetClearing('zachweps'),
        "BP: Don't take anything.",
        2000,
        "BN: Huh?",
        1500,
        "BP: You can take this guy on in hand-to-hand combat.",
        2000,
        "BP: Why bother with a weapon?",
        3000,
        "BN: Well I guess I am a pretty good fighter. B)",
        2000,
        "BN: But I dont think thats a good idea.",
        2000,
        "BN: Im taking the mop.",
        1000,
        itemRemoval('mop'),
        function() { path.zachWeapon = 'mop'; }
      ],
      'oil': [
        itemSetClearing('zachweps'),
        "BP: Take the jug of oil.",
        1500,
        "BN: This jug? Right in front of me?",
        2000,
        "BP: Yeah.",
        2000,
        "BN: Well alright.",
        1000,
        itemRemoval('oil'),
        function() { path.zachWeapon = 'oil'; },
        1000,
        "BN: Its pretty heavy.",
        1500,
        "BN: Yeah I can work with this.",
        2000,
        "BN: You sure there isnt anything better though?",
        2500,
        "BP: No, I think that's your best option.",
        2000,
        "BN: Okey dokey."
      ],
      'mop': [
        itemSetClearing('zachweps'),
        "BP: Take the mop.",
        1500,
        "BN: Oh cool.",
        1500,
        "BN: Thats actually what I was thinking too!",
        1000,
        itemRemoval('mop'),
        function() { path.zachWeapon = 'mop'; },
        1000,
        "BN: Eh",
        1000,
        "BN: Itll do."
      ]
    },
    2000,
    "BN: And thats that!",
    1500,
    "BN: Thanks for the help buddy.",
    1500,
    {switchOn: function() { return path.zachThinks; },
      'boiler-room': ["BN: Im headed to the boiler room!"],
      'break-room': ["BN: Im headed to the break room!"]},
    2000,
    "BN: Wish me luck!",
    1500,
    "BN: Not that Ill need it. B)",
    1500,
    itemRemoval('zach'),
    function() { path.zachLocation = path.zachThinks; },
    {check: function() { return path.zachThinks == path.guyLocation; },
      ifSo: [
        2000,
        function() {
          var img = 'zach-'+(path.zachWeapon||'mad');
          addItem('room1', 'zach', img, 286.079, 11.158);
          for(var l in timeouts) {
            if(l[0] == 'a') stopLine(l);
          }
        },
        1000,
        "AN: hes here!",
        1500,
        {check: function() { return path.guyWeapon; },
          ifSo: [
            "AP: Well, don't waste time texting!",
            1000,
            "AN: right!",
            1000,
            function() {
              removeItem('guy');
              var img = 'guy-'+(path.guyWeapon||'hunch');
              addItem('room1', 'guy', img, 173.724, 12.782);
            }
          ]
        },
        1500,
        function() { createjs.Sound.play('zap'); },
        250,
        roomClearing('room1'),
        {room: 'room1', img: 'turned-off'},
        4000,
        "BP: There was a power outage! I can't see you anymore!",
        3000,
        "BP: What happened, Zach?",
        {check: function() {
            return path.guyWeapon == 'lighter' && path.zachWeapon == 'oil';
          }, ifSo: [
            3000,
            "BP: Zach?",
            2000,
            "AP: Hey, are you there?",
            1500,
            "AN: yeah!",
            1000,
            "AN: i got him man!",
            1500,
            "AN: i got him!",
            2000,
            "AP: Really??",
            1500,
            "AN: yeah!!",
            1000,
            "AN: he came in carrying this big jug of oil",
            2000,
            "AN: but it was sort of leaking on him",
            2000,
            "AN: i set it on fire and",
            2000,
            "AN: and i dont know he jsut",
            2500,
            "AN: disintegrated",
            2000,
            "AN: like he was some sort of",
            2500,
            "AN: ghost",
            2000,
            "AN: a ghost with a weakness to fire i guess",
            4500,
            "AN: you there?",
            1500,
            {check: function() { return knowledge('fullstory'); },
              ifSo: [
                "AP: Yeah.",
                1500,
                "AP: Good job. He was dangerous.",
                2000,
                "AN: im just glad im alive",
                2000,
                "AN: phew!",
                3000,
                function() {
                  $('#fade').animate({opacity: 1}, 5000, 'linear', function() {
                    ending("Congratulations.");
                  });
                }
              ],
              ifNot: [
                2500,
                "AP: There's something I need to tell you about him.",
                2000,
                "AP: And you.",
                2000,
                "AP: And the universe.",
                3000,
                function() {
                  createjs.Sound.play('close');
                  ending("Did you win?");
                }
              ]
            }
          ], ifNot: [
            {check: function() { return path.helpComing; },
              ifSo: [
                3000,
                "BN: What happened?",
                2000,
                "BN: Well first I killed him.",
                2000,
                "BN: And then some people came",
                2000,
                "BN: And tried to detain me.",
                2000,
                {check: function() { return path.police; },
                  ifSo: [
                    "BN: The only way he could have known about the police",
                    3000,
                    "BN: Is if you told him."
                  ], ifNot: [
                    "BN: You sent help.",
                    2000,
                    "BN: You werent supposed to send him help."
                  ]
                },
                3000,
                "BP: No! I don't know what happened.",
                2000,
                "BP: How did you get away, anyway?",
                2000,
                "BP: Where are you now?",
                4000,
                "BN: Right behind you.",
				function() { path.teleport = true; },
                1000,
                function() {
                  createjs.Sound.play('smash');
                  setTimeout(function() {
                    ending("You are dead.");
                  }, 250);
                }
              ],
              ifNot: [
                2000,
                "BN: I got him!",
                2000,
                "BN: Thanks to your help. :)",
                4000,
                "BP: You're welcome.",
                2000,
                "BN: I am very welcome!",
                2000,
                "BN: The multiverse lives another day!",
                function() { path.multiverse = true; },
                4000,
                "BP: Yeah. That's good.",
                2000,
                function() {
                  createjs.Sound.play('close');
                  ending("Did you win?");
                }
              ]
            }
          ]
        }
      ],
      ifNot: [
        3000,
        "BN: You tricked me.",
        1500,
        "BP: Huh?",
        820,
        function() {
          createjs.Sound.play('switch');
        },
        180,
        roomClearing('room2'),
        {room: 'room2', img: 'break-room'},
        {room: 'room2', item: 'zach', img: 'zach-angry', x: 199.029, y: 23.757},
        function() { path.teleport = true; },
        1000,
        "BN: He isnt here.",
        3000,
        "BP: How did you get there so fast?",
        1500,
        "BN: Hmph.",
        2500,
        "BN: This is why I keep secrets.",
        2000,
        "BN: I can never trust you people.",
        4000,
        "BN: That question has a complicated answer.",
        2000,
        "BN: Maybe it wouldn't be so bad to get it off my chest.",
        2500,
        "BN: You know that I kill alternate universe versions of myself.",
        function() { path.killer = path.multiverse = path.guyIdentity = true; },
        2500,
        "BP: Yes.",
        1500,
        "BN: But do you know why?",
        2500,
        "BP: You're susceptible to accidental reality jumps.",
        2500,
        "BP: For some reason, the jumps always land in this universe.",
        2500,
        "BP: If two instances of the same person are alive in one universe for too long...",
        3000,
        "BP: The multiverse falls apart.",
        2500,
        "BN: Yes.",
        2000,
        "BN: Thats what I said isnt it.",
        2000,
        "BN: And you believed me.",
        2000,
        "BN: Because when something happens before your eyes and you cant explain it",
        3000,
        "BN: You just cant help but trust a friendly person who can.",
        2500,
        "BP: Huh?",
        2000,
        "BN: I bring them here.",
        2000,
        "BN: It isnt accidental.",
        2000,
        "BN: I bring them from worlds where they wouldnt think to call the police.",
        3000,
        "BN: And I make sure whoever they do call is on my side.",
        2500,
        "BP: Me.",
        1500,
        "BN: Yes.",
        2000,
        "BP: Why would you want to kill a bunch of versions of yourself?",
        2500,
        "BP: Are you some sort of self-serial killer?",
        2500,
        "BN: I said I was answering your question didnt I?",
        3000,
        "BN: I can jump between their bodies.",
        2000,
        "BN: Theyre invisible and intangible when Im not in them.",
        2500,
        "BN: Its a lot like teleportation.",
        2000,
        "BP: Okay. So, I guess you suck a lot more than I thought.",
        2500,
        "BP: And I'm pretty happy about my decision not to help you.",
        2500,
        "BP: But what do you need teleportation for?",
        2000,
        "BN: This.",
        function() {
          setKnowledge('fullstory');
        },
        zachMurder,
        undefined
      ]
    }
  );
  if(!(knowledge('multiverse') && knowledge('noPolice') && knowledge('killer') && knowledge('guyIdentity'))) {
    breakChoices.splice(0,1);
    breakCallbacks.splice(0,1);
  }
  function populateWarehouse() {
    addItem('room2', 'oil', 'oil', 247.585, 102.649, 'Oil');
    addItem('room2', 'mop', 'mop', 388.649, 13.680, 'Mop');
  }
  function populateBoilerRoom() {
    addItem('room1', 'lighter', 'lighter', 213.297, 13.789, 'Lighter');
    addItem('room1', 'stove', 'stove', 319.434, 82.674, 'Camp Stove');
  }
  function zachMurder() {
    path.zachMurder = true;
    var bg = $('#room2').css('background-image');
    bg = bg.substring(bg.lastIndexOf('img/bg/')+7, bg.lastIndexOf('.svg'));
    var populate = function() {  };
    if(bg == 'warehouse')
      populate = populateWarehouse;
    doDialogue([
      function() { createjs.Sound.play('buzz'); },
      500,
      {room: 'room2', img: 'turned-off'},
      roomClearing('room2'),
      1000,
      function() { createjs.Sound.play('buzz'); },
      {room: 'room2', img: bg},
      populate,
      500,
      {room: 'room2', img: 'turned-off'},
      roomClearing('room2'),
      500,
      function() { createjs.Sound.play('zap'); },
      {room: 'room2', img: bg},
      populate,
      250,
      {room: 'room2', img: 'turned-off'},
      roomClearing('room2'),
      3000,
      "BP: Zach?",
      2000,
      function() { putAwayPhone('a'); },
      3000,
      "BP: Hello?",
      3000,
      "BP: Zach?",
      5000,
      function() {
        createjs.Sound.play('smash');
        setTimeout(function() {
          ending("You are dead.");
        }, 250);
      }
    ], 'zm');
  }
}

function whatPhone(element) {
  return element.parents('#a, #b').attr('id');
}

function grabPhone(phone, callback) {
  $('#'+phone+' .phonec').animate({transform: ''}, 750, 'swing', callback);
  createjs.Sound.play('rustle');
}
function putAwayPhone(phone, callback) {
  $('#'+phone+' .phonec').animate({transform: phoneAway[phone]}, 750, 'swing', callback);
  createjs.Sound.play('rustle');
}
function turnOffPhone(phone) {
  var scr = $('#'+phone+' .phones');
  scr.empty();
  scr.css('background-color', 'black');
}
function sendMessage(phone, sender, msg) {
  var phoneDiv = $('#'+phone+' .phone');
  if(!phoneDiv.length) return;
  var textDiv = $('<div class="'+sender+'msg">'+msg+'</div>');
  phoneDiv.append(textDiv);
  phoneDiv.stop();
  phoneDiv.css('bottom', parseFloat(phoneDiv.css('bottom'))-parseFloat(textDiv.outerHeight(true)));
  phoneDiv.animate({bottom: 45}, 200);
  createjs.Sound.play('blip', 'none', 0, 0, 0, 1/4);
}
function setChoices(phone, them, callbacks) {
  if(!$('#'+phone+' .phone').length) return;
  choices[phone] = {};
  for(var i = 0; i < them.length; ++i)
    choices[phone][i] = them[i];
  choices[phone].length = them.length;
  choices[phone].callbacks = callbacks;
  selectChoice(phone, 0);
  var textbox = $('#'+phone+' .textbox');
  textbox.css('opacity', 0);
  textbox.animate({opacity: 1}, 300);
}
function injectChoices(phone, them, callbacks) {
  them = them.slice();
  callbacks = callbacks.slice();
  for(var i = 0; i < choices[phone].length; ++i) {
    them.push(choices[phone][i]);
    callbacks.push(choices[phone].callbacks[i]);
  }
  setChoices(phone, them, callbacks);
}
function clearChoices(phone) {
  setChoices(phone, []);
}
function selectChoice(phone, choice) {
  var textbox = $('#'+phone+' .textbox');
  if(choices[phone].length == 0) {
    textbox.text('');
    return;
  }
  choices[phone].selected = choice;
  textbox.text(choices[phone][choice]);
  textbox = textbox.parent();
  var size = 16;
  var tbheight = textbox.css('height');
  textbox.css('height', 'auto');
  do {
    textbox.css('font-size', (size--)+'px');
  } while(textbox.outerHeight(false) > 41);
  textbox.css('height', tbheight);
}
function chooseChoice(phone, choice) {
  var callback = choices[phone].callbacks;
  if(callback) {
    callback = callback[choice];
    if(callback)
      callback();
  }
  clearChoices(phone);
}
function setBG(room, img) {
  $('#'+room).css('background-image', 'url(\'img/bg/'+img+'.svg\')');
}
function addItem(room, item, img, x, y, title) {
  var el = $('<img src="img/item/'+img+'.svg" id="item'+item+'"></img>');
  if(title !== undefined)
    el.attr('title', title);
  el.css({position: 'absolute', left: x, bottom: y});
  $('#'+room).append(el);
}
function removeItem(item) {
  $('#item'+item).remove();
}
function itemRemoval(item) {
  return function() {
    removeItem(item);
  };
}
function clearRoom(room) {
  $('#'+room).empty();
}
function roomClearing(room) {
  return function() {
    clearRoom(room);
  };
}
function clearItemSet(set) {
  var s = itemSets[set];
  for(var i = 0; i < s.length; ++i) {
    var item = $('#item'+s[i]);
    item.off('click mouseenter mouseleave');
    item.css('opacity', 1);
    item.css('cursor', 'default');
  }
  delete itemSets[set];
}
function itemSetClearing(set) {
  return function() {
    clearItemSet(set);
  };
}
function appended(arr, app) {
  Array.prototype.push.apply(arr, app);
  return arr;
}
function dialogue(parts, timeout, index) {
  return function() {
    doDialogue(parts, timeout, index);
  };
}
function doDialogue(parts, timeout, index) {
  if(!index) index = 0;
  var part = parts[index], type = typeof part;
  switch(type) {
    case 'string': {
      sendMessage(part[0].toLowerCase(), part[1].toLowerCase()=='p'?'pc':'npc', part.substr(4));
      doDialogue(parts, timeout, index+1);
      break;
    }
    case 'number': {
      var to = setTimeout(dialogue(parts, timeout, index+1), part / acceleration);
      if(typeof timeout == 'string')
        timeouts[timeout] = to;
      break;
    }
    case 'object': {
      if(typeof part.ph == 'string') {
        if(part.cb && part.cb.length && Array.isArray(part.cb[0])) {
          part = {ph: part.ph, ch: part.ch, cb: part.cb};
          var remainder = parts.slice(index+1);
          for(var i = 0; i < part.cb.length; ++i) {
            part.cb[i] = dialogue(part.cb[i].concat(remainder), timeout);
          }
        }
        injectChoices(part.ph, part.ch, part.cb);
        break;
      } else if(typeof part.x == 'number')
        addItem(part.room, part.item, part.img, part.x, part.y, part.title);
      else if(typeof part.img == 'string')
        setBG(part.room, part.img);
      else if(typeof part.set == 'string') {
        itemSets[part.set] = [];
        var remainder = parts.slice(index+1);
        for(var item in part) {
          if(item == 'set') continue;
          itemSets[part.set].push(item);
          var cb = part[item];
          if(Array.isArray(cb))
            cb = dialogue(cb.concat(remainder), timeout);
          item = $('#item'+item);
          item.click(cb);
          item.hover(function() {
            $(this).css('opacity', 0.75);
          }, function() {
            $(this).css('opacity', 1);
          });
          item.css('cursor', 'pointer');
        }
        break;
      } else if(typeof part.check == 'function') {
        var remainder = parts.slice(index+1);
        var action = part.check() ? part.ifSo : part.ifNot;
        if(Array.isArray(action))
          action = dialogue(action.concat(remainder), timeout);
        if(typeof action == 'function') {
          action();
          break;
        }
      } else if(typeof part.switchOn == 'function') {
        var remainder = parts.slice(index+1);
        var action = part[part.switchOn()];
        if(Array.isArray(action))
          action = dialogue(action.concat(remainder), timeout);
        if(typeof action == 'function') {
          action();
          break;
        }
      }
      doDialogue(parts, timeout, index+1);
      break;
    }
    case 'function': {
      part();
      doDialogue(parts, timeout, index+1);
      break;
    }
  }
}
function ending(message) {
  if(path.multiverse) setKnowledge('multiverse');
  if(path.noPolice) setKnowledge('noPolice');
  if(path.killer) setKnowledge('killer');
  if(path.guyIdentity) setKnowledge('guyIdentity');
  for(var l in timeouts) {
    stopLine(l);
  }
  var game = $('#game');
  game.empty();
  game.css({'background-color': 'black', 'background-image': 'none', 'text-align': 'center'});
  setTimeout(function() {
    var ending = $('<div id="ending">'+message+'</div>');
    game.append(ending);
    ending.css('opacity', 0);
    ending.animate({opacity: 1}, 2000);
  }, 2000);
  setTimeout(function() {
    var replay = $('<div id="replay">Click here or reload to replay.</div>');
    game.append(replay);
    replay.click(function() {
      document.location.reload();
    });
    replay.css('opacity', 0);
    replay.animate({opacity: 1}, 2000);
  }, 6000);
}
function stopLine(line) {
  clearTimeout(timeouts[line]);
  delete timeouts[line];
}
function setKnowledge(bit) {
  localStorage[bit] = 'true';
}
function knowledge(bit) {
  return localStorage[bit] == 'true';
}