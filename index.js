"user strict";
var Alexa = require('alexa-sdk');
var arr = [{"Q":"dcha","A":"chad"},
           {"Q":"goto","A":"togo"},
           {"Q":"ilma","A":"mali"}
          ];

exports.handler = function(event,context,callback) {
  var alexa = Alexa.handler(event,context, callback);
  alexa.dynamoDBTableName = "CountryLetters";
  alexa.appId = "<APP ID>";
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
    var speech = "Welcome back, here are your jumbled letters " + q + ". Guess the country, you have " + count + " attempts left ";
    this.emit(":askWithCard", speech, speech, "Guess My Country", qc);
  },
  "resume": function() {
    var index = this.attributes.Game.index;
    var count = this.attributes.Game.count;
    var question = arr[index].Q;
    var q = "<break time='0.5s'/>" + question.split('').join("<break time='0.5s'/>") + "<break time='0.5s'/>";
    var qc = question.split('').join("  ");
    var speech = "Welcome back, here are your jumbled letters " + q + ". Guess the country, you have " + count + " attempts left ";
    this.emit(":askWithCard", speech, speech, "Guess My Country", qc);
  },

  "AMAZON.StartOverIntent": function() {
    if(this.attributes.Game.score === undefined) {
        this.emit('start');
    } else {
        var speech = "You have already played the game. Your score is " + this.attributes.Game.score + ". To resume your game say, resume my game, or to delete your previous game and start again, say delete my previous game";
        this.emit(':ask', speech, speech)
    }
  },
  "AMAZON.ResumeIntent": function() {
    this.emit('resume')
  },
  "DeleteIntent": function() {
    this.emit('start')
  }
};
