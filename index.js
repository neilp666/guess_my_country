"user strict";
var Alexa = require('alexa-sdk');
var arr = [{"Q":"dcha","A":"chad"},
           {"Q":"goto","A":"togo"},
           {"Q":"ilma","A":"mali"}
          ];

exports.handler = function(event,context,callback) {
  var alexa = Alexa.handler(event,context, callback);
  alexa.dynamoDBTableName = "CountryLetters";
  alexa.appId = "";
  alexa.registerHandlers(handler);
    initialize(event, function() {
      alexa.execute();
    });
};

function initialize(event, callback){
  if(event.session.attributes.Game === undefined) {
      event.session.attributes.Game = {};
  }
}

var handler = {
  "start": function() {
    this.attributes.Game.score = 0;
    this.attributes.Game.index = 0;
    this.attributes.Game.count = 3;
    var question = arr[0].Q;
    var q = "<break time='0.5s'/>" + question.split('').join("<break time='0.5s'/>") + "<break time='0.5s'/>";
    var qc = question.split('').join("  ");
    var speech = "Welcome to Guess the country, let's begin, here are your jumbled letters " + q + ". Guess the country, you have 3 attempts left ";
    this.emit(":askWithCard", speech, speech, "Guess My Country", qc);
  },
  "resume": function() {
    var index = this.attributes.Game.index;
    var count = this.attributes.Game.count;
    var question = arr[index].Q;
    var q = "<break time='0.5s'/>" + question.split('').join("<break time='0.5s'/>") + "<break time='0.5s'/>";
    var qc = question.split('').join("  ");
    var speech = "Welcome back, to Guess the country, here are your jumbled letters " + q + ". Guess the country, you have " + count + " attempts left ";
    this.emit(":askWithCard", speech, speech, "Guess My Country", qc);
  },
  "LaunchRequest": function() {
    if(this.attributes.Game.score === undefined) {
        this.emit('start');
    } else if (this.attributes.Game.end === 1) {
        var score = this.attributes.Game.score;
        var speech1 = "I have asked all the questions that I have, you have scored " + score + "if you wish to delete this game and start over again , say delete my previous game"
        this.emit(":ask", speech1, speech1);
    } else {
        var speech = "You have already played the game. Your score is " + this.attributes.Game.score + ". To resume your game say, resume my game, or to delete your previous game and start again, say delete my previous game";
        this.emit(':ask', speech, speech)
    }
  },

  "AMAZON.StartOverIntent": function() {
    if(this.attributes.Game.score === undefined) {
        this.emit('start');
    } else if (this.attributes.Game.end === 1) {
        var score = this.attributes.Game.score;
        var speech1 = "I have asked all the questions that I have, you have scored " + score + "if you wish to delete this game and start over again , say delete my previous game"
        this.emit(":ask", speech1, speech1);
    } else {
        var speech = "You have already played the game. Your score is " + this.attributes.Game.score + ". To resume your game say, resume my game, or to delete your previous game and start again, say delete my previous game";
        this.emit(':ask', speech, speech)
    }
  },
  "AnswerIntent": function() {
    var guess = this.event.request.intent.slots.Guess.value;
    var l1 = this.event.request.intent.slots.LetterOne.value;
    var l2 = this.event.request.intent.slots.LetterTwo.value;
    var l3 = this.event.request.intent.slots.LetterThree.value;
    var l4 = this.event.request.intent.slots.LetterFour.value;
    var index = this.attributes.Game.index;
    var count = this.attributes.Game.count;
    var answer = arr[index].A;
    var a = answer.split('');
    if(guess !== undefined && l1 !== undefined && l2 !== undefined && l3 !== undefined && 14 !== undefined){
      l1 = l1.toLowerCase();
      l2 = l2.toLowerCase();
      l3 = l3.toLowerCase();
      l4 = l4.toLowerCase();
      if(guess === answer && l1 === a[0] || l1 === a[0] + "." ) && (l2 === a[1] || l2 === a[1] + "." ) && (l3 === a[2] || l3 === a[2] + "." ) && (l4 === a[3] || l4 === a[3] + "." ))
          this.attributes.Game.score += 1;
          var score = this.attributes.Game.score;
          var speech = "Well Done,  you have guessed it right in " + (4-count) + " attempts. Your score is " + score + ". Do you wish to play again? say Yes to play again an No to quit."
          this.emit(":ask", speech, speech);
      } else {
          this.attributes.Game.count -= 1;
          count = this.attributes.Game.count;
          var question = arr[index].Q;
          var q = "<break time='0.5s'/>" + question.split('').join("<break time='0.5s'/>") + "<break time = '0.5s'/>";
          if(count > 0){
            var speech1 = "Please try again, your jumbled letters were " + q + ". You have " + count + " attempts left";
            this.emit(":ask", speech1, speech1);
          } else {
            var ans = "<break time = '0.5s'/>" + answer.split('').join("<break time='0.5s'/>") + "<break time='0.5s'/>";
            var speech2 = "Sorry, there are no attempts left, the correct country is " + ans + answer + ". Do you wish to play again? say Yes to play again and no to quit";
            this.emit(":ask", speech2, speech2);
          }
      }
    } else {
        this.emit(":ask", "Please guess by spelling out the country", "Please guess by spelling the country");
    }
  },
  "AMAZON.YesIntent": function() {
    if(this.attributes.Game.index === arr.length - 1)
        this.attributes.Game.end = 1;
        var score = this.attributes.Game.score;
        var speech = "I have asked all the questions that I have, you have scored " + score + " If you wish to delete this game and start over again say delete my previous game";
        this.emit(":ask",speech, speech);
  } else {
      this.attributes.Game.index +=1;
      this.attributes.Game.count = 3;
      this.emit('resume');
    }
  },
  "AMAZON.NoIntent": function() {
    if(this.attributes.Game.index === arr.length - 1)
        this.attributes.Game.end = 1;
        var score = this.attributes.Game.score;
        var speech = "I have asked all the questions that I have, you have scored " + score + " If you wish to delete this game and start over again say delete my previous game";
        this.emit(":ask",speech, speech);
  } else {
      this.attributes.Game.index +=1;
      this.attributes.Game.count = 3;
      this.emit('resume');
    }
  },
  "AMAZON.NoIntent": function() {
    if(this.attributes.Game.index === arr.length -1) {
      this.attributes.Game.end = 1;
      this.emit(":tell", "Thank You");
    } else {
      this.attributes.Game.index += 1;
      this.attributes.Game.count = 3;
      this.emit(":tell", "Thank You");
    }
  },
  "AMAZON.ResumeIntent": function() {
    if(this.attributes.Game.score === undefined) {
      var speech = "You have not started the game yet, to start the game say, start a game"
      this.emit(":ask",speech ,speech)
    }
    else if (this.attributes.Game.end === 1) {
        var score = this.attributes.Game.score;
        var speech1 = "I have asked all the questions that I have, you have scored " + score + "if you wish to delete this game and start over again , say delete my previous game"
        this.emit(":ask", speech1, speech1);
    } else {
        this.emit('resume');
    }
  },
  "DeleteIntent": function() {
    if(this.attributes.Game.score === undefined) {
        var speech = "You have not started the game yet, to start the game say, start a game";
        this.emit(":ask", speech, speech);
    } else {
        this.attributes.Game.end = 0;
        this.emit('start');
    }
  },
  "AMAZON.StopIntent": function() {
    this.emit(":tell", "Thank You");
  },
  "AMAZON.CancelIntent": function() {
    this.emit(":tell", "Thank you")
  },
  "AMAZON.HelpIntent": function() {
    this.emit(":ask", "I will spell out the Jumbled letters of a country, you have to guess the country by spelling out the letters in the right order and also say the country, to continue say, reusme my game")
  }
};
