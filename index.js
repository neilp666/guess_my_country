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
