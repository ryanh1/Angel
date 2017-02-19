'use strict';

var Alexa = require("alexa-sdk");



exports.handler = function(event, context, callback) {
        var alexa = Alexa.handler(event, context);
        // alexa.dynamoDBTableName = 'AngelInformation'; // That's it!
        alexa.registerHandlers(handlers);
        alexa.execute();
};

// Variables
var places  = new Map()
var sos     = new Map()
var dates   = new Map()
var mode = 'demo'
var data = {
    InitialPrompt: 'What can I help you remember?',
    RepeatPrompt: '  What else can I help you remember?',
    
    DemoResponse0: 'I am an angel on your shoulder, your guide to life and tricky social situations.  What can I help you with?',
    DemoResponse1: 'That must be so embarrasing.  How do you still have friends? No worries.  I will remember for you.  Tell me about your friends when you first meet them, and when you see them in the future, I can remind you about who they are.  Lets try it now.',
    DemoResponse2: 'Lets pretend that its one year from now and youre at a party.  You see James and his wife again.  He remembers everything about you, but you remember nothing about him.  What would you like to ask me?',
    DemoResponse3: 'Now you can have graceful conversations and avoid embarrassing yourself.  Make lots of great friends.'
}

var handlers = {
    'LaunchRequest': function () {
        if (mode === 'demo') {
            this.emit('DemoIntentZero')
        } else {
            this.emit('PromptUser');
        }
    },
    
    'DemoIntentZero': function() {
        this.emit(':ask', data.DemoResponse0);
    },
    
    'DemoIntentOne': function() {
        this.emit(':ask', data.DemoResponse1)
    },
    
    'DemoIntentTwo': function() {
        this.emit(':ask', data.DemoResponse2)
    },
    
    'DemoIntentThree': function() {
        this.emit(':tell', data.DemoResponse3)
    },
    
    'PromptUser': function () {
        this.emit(':ask', data.InitialPrompt)
    },
    
    'RememberSoIntent': function () {
        var personValue         = this.event.request.intent.slots.person.value;
        var soValue             = this.event.request.intent.slots.so.value;
        sos.set(personValue, soValue)
        // dataMap[name]  = personValue
        // data.place1 = placeValue
        // var rememberLocationResponse = 'Ok, I will remember that ' + 
        // data.name1 + ' is from ' + data.place1 + "!  ";
        var rememberSoResponse = 'Ok, I will remember that ' +
        personValue + ' significant other is named '+ sos.get(personValue)
        this.emit(':ask', rememberSoResponse + data.RepeatPrompt)
    },
    
    'RemindSoIntent': function() {
        var personValue = this.event.request.intent.slots.person.value;

        if ( sos.has(personValue) === false) {
            var noSoMessage = ' You have not told me who ' + personValue
            + ' significant other is. '
            this.emit(':ask', noSoMessage + " . " + data.RepeatPrompt)
        } else {
            var remindSoResponse    = personValue + ' significant other is '
            + sos.get(personValue) + "!  ";
            this.emit(':ask', remindSoResponse + " . " + data.RepeatPrompt)
        }

    },
    
    'RememberLocationIntent': function() {
        var personValue         = this.event.request.intent.slots.person.value;
        var placeValue          = this.event.request.intent.slots.place.value;
        places.set(personValue, placeValue)
        var rememberLocationResponse = 'Ok, I will remember that ' +
        personValue + ' is from ' + places.get(personValue)
        this.emit(':ask', rememberLocationResponse + data.RepeatPrompt)
    },
    
    'RemindLocationIntent': function () {
        var personValue = this.event.request.intent.slots.person.value;

        if ( places.has(personValue) === false) {
            var noPersonMessage = ' You have not told me where ' + personValue
            + ' is from. '
            this.emit(':ask', noPersonMessage + " . " + data.RepeatPrompt)
        } else {
            var remindLocationResponse    = personValue + ' is from ' + 
            places.get(personValue) + "!  ";
            this.emit(':ask', remindLocationResponse + " . " + data.RepeatPrompt)
        }
    },
    
    'RememberDateIntent': function() {
        var personValue         = this.event.request.intent.slots.person.value;
        var dateValue          = this.event.request.intent.slots.date.value;
        dates.set(personValue, dateValue)
        var rememberDatesResponse = 'Ok, I will remember that you met' +
        personValue + ' on ' + dates.get(personValue)
        this.emit(':ask', rememberDatesResponse + data.RepeatPrompt)
    },
    
    'RemindDateIntent': function () {
        var personValue = this.event.request.intent.slots.person.value;

        if ( dates.has(personValue) === false) {
            var noDateMessage = ' I have no record of your ever meeting '
            + personValue
            this.emit(':ask', noDateMessage + " . " + data.RepeatPrompt)
        } else {
            var remindDateResponse    = ' You met ' + personValue + ' on '
            + dates.get(personValue) + "!  ";
            this.emit(':ask', remindDateResponse + " . " + data.RepeatPrompt)
        }
    },

    'QuitIntent': function () {
        // for (var key of places.keys()) {
        //     this.placeValue[key] = places(key);
            // var places  = new Map()
            // var sos     = new Map()
            // var dates   = new Map()
        // }
        this.emit(':tell', "");

    }

};