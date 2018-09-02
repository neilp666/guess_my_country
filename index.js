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
    var speech = "Welcome to Guess My Country, let's begin, here are your jumbled letters " + q + ". Guess the word, you have 3 attempts left ";
    this.emit(":askWithCard", speech, speech, "Guess My Country", qc);
  },
}
