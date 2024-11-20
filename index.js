/*
 * _______________________________________
 *  K A N S A S   P U B L I C   R A D I O
 *           A L E X A   S K I L L
 * =======================================
 *
 * Developer: Danny Mantyla
 * Date: November 2020
 * Version 2.0
 *
 */

'use strict';
const Alexa = require('alexa-sdk');

// constants
const APP_ID = 'amzn1.ask.skill.f2e3063a-66ea-4a12-8f99-47175ba412b2';
const NEWSCASTURL = "https://streaming.kansaspublicradio.org:8001/mp3/newscast.mp3";
const ONDEMANDURL = 'https://ondemand.kansaspublicradio.org/mp3/'; // not used?
const STREAMURL = "https://portal.kansaspublicradio.org/kpr.m3u";
const STREAMURL2 = "https://portal.kansaspublicradio.org/kpr2.m3u";

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: '<say-as interpret-as="spell-out">kpr</say-as>',
            HELP_MESSAGE: 'You can say "play <say-as interpret-as="spell-out">kpr</say-as>", "play <say-as interpret-as="spell-out">kpr</say-as> two", "play ondemand", or "play the local newscast."',
            HELP_REPROMPT: 'If you are having trouble listening to <say-as interpret-as="spell-out">kpr</say-as>, you can call our engineer at <say-as interpret-as="telephone">785-864-2238</say-as>.',
            STOP_MESSAGE: 'Thank you for listening!',
            LAUNCH_MESSAGE: 'This is Kansas Public Radio. You can ask me to play <say-as interpret-as="spell-out">kpr</say-as>, play <say-as interpret-as="spell-out">kpr</say-as> 2, play on demand, or play the latest newscast. What shall it be?',
            LAUNCH_MESSAGE_REPROMPT: "I'm sorry but I didn't catch that. Can you tell me again what you would like to hear from KPR?",
            DO_NOT_UNDERSTAND_MESSAGE: "I'm sorry but I don't understand.",
            NOW_PLAYING_MESSAGE: 'Say "Play the live stream" if you would like to listen to this program, or ask me to play on-demand if you would like to listen to a different program',
            NOW_PLAYING_MESSAGE_REPROMPT: 'Say "Play the live stream" if you would like to listen to this program.',
        },
    },
    'en-US': {
        translation: {
            SKILL_NAME: '<say-as interpret-as="spell-out">kpr</say-as>',
        },
    },
    'en-GB': {
        translation: {
            SKILL_NAME: '<say-as interpret-as="spell-out">kpr</say-as>',
        },
    },

};

const onDemandObjects = [
    {
        title: 'film music friday',
        ssml: 'film music friday',
        feed: 'https://kansaspublicradio.org/podcast/film-music-friday/rss.xml',
    },
    {
        title: 'retro cocktail hour',
        ssml: 'retro cocktail hour',
        feed: 'https://kansaspublicradio.org/podcast/retro-cocktail-hour/rss.xml',
    },
    {
        title: 'live at green lady lounge',
        ssml: 'live at green lady lounge',
        feed: 'https://kansaspublicradio.org/podcast/live-at-green-lady-lounge/rss.xml',
    },
    {
        title: 'live jazz performances',
        ssml: 'live jazz performances',
        feed: 'https://api.npr.org/query?orgId=4&dateType=story&output=MediaRSS&fields=image,byline,fullText&action=or&id=1165861090&numResults=25&apiKey=MDAxODM1MzkxMDEyMTY5MDA4NjI2NGQ4Yg004',
    },
    {
        title: 'live classical performances',
        ssml: 'live classical performances',
        feed: 'https://api.npr.org/query?orgId=4&dateType=story&output=MediaRSS&fields=image,byline,fullText&action=or&id=1165858948&numResults=25&apiKey=MDAxODM1MzkxMDEyMTY5MDA4NjI2NGQ4Yg004',
    },
    {
        title: 'live folk performances',
        ssml: 'live folk performances',
        feed: 'https://api.npr.org/query?orgId=4&dateType=story&output=MediaRSS&fields=image,byline,fullText&action=or&id=1165859593&numResults=25&apiKey=MDAxODM1MzkxMDEyMTY5MDA4NjI2NGQ4Yg004',
    },
    {
        title: 'conversations',
        ssml: 'conversations',
        feed: 'https://kansaspublicradio.org/podcast/conversations/rss.xml',
    },
    {
        title: 'when experts attack',
        ssml: 'when experts attack',
        feed: 'http://feeds.libsyn.com/250961/rss',
    },
    {
        title: 'kpr presents',
        ssml: '<say-as interpret-as="spell-out">kpr</say-as> pri zents',
        feed: 'https://kansaspublicradio.org/podcast/kpr-presents/rss.xml',
    },
    {
        title: 'commentaries',
        ssml: 'commentaries',
        feed: 'https://api.npr.org/query?orgId=4&dateType=story&output=MediaRSS&fields=image,byline,fullText&action=or&id=1165941049&numResults=25&apiKey=MDAxODM1MzkxMDEyMTY5MDA4NjI2NGQ4Yg004',
    },
    {
      title: 'classics live',
      ssml: 'classics live',
      feed: 'https://api.npr.org/query?orgId=4&dateType=story&output=MediaRSS&fields=image,byline,fullText&action=or&id=1147893214&numResults=25&apiKey=MDAxODM1MzkxMDEyMTY5MDA4NjI2NGQ4Yg004',
    },
    {
      title: '105 live',
      ssml: 'one oh five live',
      feed: 'https://kansaspublicradio.org/podcast/105-live/rss.xml',
    }
];


// handlers
const handlers = {

    // custume intents
    'LaunchRequest': function () {
        this.response.speak(this.t('LAUNCH_MESSAGE')).listen(this.t('LAUNCH_MESSAGE_REPROMPT'));
        this.emit(':responseReady');
    },

    'playLiveStreamIntent': function() {
        var words = "Now playing <say-as interpret-as='spell-out'>kpr</say-as>.";
        this.response.speak(words).audioPlayerPlay("REPLACE_ALL", STREAMURL, "1", null, 0); //(behavior, url, token, expectedPreviousToken, offsetInMilliseconds)
        this.emit(':responseReady');
    },

    'playOnDemandIntent': function() {

        // autodelegate must be on

        // get the name of the program they gave to Alexa:
        var programTitle = this.event.request.intent.slots.programNameSlot.value;

        console.log('playing on demand program: ' + programTitle);

        // correct any problems with the title string
        var titleReplacements = {
            'k. p. r. presents':'kpr presents',
            'KPR presents':'kpr presents',
            'kay pee are presents':'kpr presents',
            'kay pee our presents':'kpr presents',
            'jazz':'live jazz performances',
            'classical':'live classical performances',
            'folk':'live folk performances',
            'live jazz':'live jazz performances',
            'live classical':'live classical performances',
            'live folk':'live folk performances',
            'jazz performances':'live jazz performances',
            'classical performances':'live classical performances',
            'folk performances':'live folk performances',
            'jazz performance':'live jazz performances',
            'classical performance':'live classical performances',
            'folk performance':'live folk performances',
            'live jazz performance':'live jazz performances',
            'live classical performance':'live classical performances',
            'live folk performance':'live folk performances',
            'metro cocktail hour':'retro cocktail hour',
            'metro cocktail':'retro cocktail hour',
            'retro cocktail':'retro cocktail hour',
            'cocktail hour':'retro cocktail hour',
            'experts attack':'when experts attack',
            'film music fridays':'film music friday',
            'film music Fridays':'film music friday',
            'film music Friday':'film music friday',
            'classic live':'classics live',
            'classical live':'classics live',
            'live music':'live classical performances',
            'live studio':'live classical performances',
            'the jazz':'live jazz performances',
            'jazz scene':'live jazz performances',
            'the jazz scene':'live jazz performances',
            'jazz with david basse':'live jazz performances',
            'jazz in the night':'live jazz performances',
            'the retro cocktail hour':'retro cocktail hour',
            'the trail mix':'live folk performances',
            'classic':'classics live',
            'conversation':'conversations',
            'r. c. h.':'retro cocktail hour',
            'classics':'classics live',
            'the green lady lounge':'live at green lady lounge',
            'green lady lounge':'live at green lady lounge',
            'the green lady':'live at green lady lounge',
            'green lady':'live at green lady lounge',
            'live at green lady':'live at green lady lounge',
            'live at the green lady lounge':'live at green lady lounge',
            'live at the green lady':'live at green lady lounge',
            'one of five':'105 live',
            '1 oh 5':'105 live',
            'one hundred and five live':'105 live',
        };
        if (programTitle in titleReplacements) {
            programTitle = titleReplacements[programTitle];
        }

        // get the show they want to hear
        var showObjs = onDemandObjects.filter(function(x){
          if(x.title == programTitle) return true;
        });
        if (showObjs.length < 1) {
          var programs = getOnDemandTitlesSSML();
          this.response.speak("I couldn't find a program called " + programTitle + ". Available programs are " + programs + ". To try again, tell me to play on demand.").listen(this.t('LAUNCH_MESSAGE_REPROMPT'));
          this.emit(':responseReady');
        }

        var showObj = showObjs[0];
        var feedURL = showObj.feed;

        console.log("getting XML URL: " + feedURL);

        // get the XML file
        var request = require("request");
        const options = {
            url: feedURL,
            timeout: 15000
        };

        request.get(options, (error, response, xml) => {
            // notice that, instead of normal annonymous function, the arrow function expression is used: () => {}
            // this is because it allows us to use the 'this' binding of the parent function inside the lambda function
            // https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback

            console.log('http error:', error); // Print the error if one occurred
            console.log('http statusCode:', response && response.statusCode); // Print the response status code if a response was received

            // now get the url of the mp3 for the first episode by parsing through the xml
            var parseString = require('xml2js').parseString;
            parseString(xml, (err, result) => {
                // asyncronous callback fundtion nested inside of asyncronous callback function.... 8)

                console.log('xml parse error: ' + err);

                var onDemandMp3 = '';
                if (typeof result.rss.channel[0].item[0].enclosure != "undefined") {
                    // itunes style
                    var onDemandMp3 = result.rss.channel[0].item[0].enclosure[0].$.url;
                } else if (typeof result.rss.channel[0].item[0]['media:group'] != "undefined") {
                    // npr style
                    var onDemandMp3 = result.rss.channel[0].item[0]['media:group'][0]['media:content'][0].$.url;
                } else {
                    var onDemandMp3 = false;
                }

                var token = programTitle;

                // build the response
                if (onDemandMp3) {
                    // success
                    console.log('playing mp3: ' + onDemandMp3)
                    var words = "Now playing the latest recording of " + showObj.ssml;
                    this.response.speak(words).audioPlayerPlay("REPLACE_ALL", onDemandMp3, token, null, 0); //(behavior, url, token, expectedPreviousToken, offsetInMilliseconds)
                    this.emit(':responseReady');
                } else {
                    // not found
                    console.log('ERROR! mp3 url not found in the xml')
                    var words = "I'm sorry but there was a problem playing on demand. You can try listening to another on demand program, or you can listen to the live stream.";
                    this.response.speak(words).listen(this.t('LAUNCH_MESSAGE_REPROMPT'));
                    this.emit(':responseReady');
                }
            });
        });
    },

    'playKPRtwoIntent': function () {
        var words = "Now playing <say-as interpret-as='spell-out'>kpr</say-as> two, our all talk and news station.";
        this.response.speak(words).audioPlayerPlay("REPLACE_ALL", STREAMURL2, "1", null, 0); //(behavior, url, token, expectedPreviousToken, offsetInMilliseconds)
        this.emit(':responseReady');
    },

    'playNewscastIntent': function () {
        var words = "Now playing your local <say-as interpret-as='spell-out'>kpr</say-as> newscast for north east Kansas.";
        this.response.speak(words).audioPlayerPlay("REPLACE_ALL", NEWSCASTURL, "1", null, 0); //(behavior, url, token, expectedPreviousToken, offsetInMilliseconds)
        this.emit(':responseReady');
    },

    'startDonationIntent': function () {
        const speechOutput = "This feature is coming soon. ";
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },

    // default intents
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.response.audioPlayerStop();
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.audioPlayerStop();
        this.emit(':responseReady');
    },
    'AMAZON.PauseIntent': function () {
        this.response.audioPlayerStop();
        this.emit(':responseReady');
    },
    'AMAZON.ResumeIntent': function () {
        this.response.audioPlayerPlay("REPLACE_ALL", STREAMURL, "1", null, 0);
        this.emit(':responseReady');
    },

    'Unhandled': function () {
        this.emit('playLiveStreamIntent');
    },
};



exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


/* HELPER FUNCTIONS */

// make a SSML list of program titles
var getOnDemandTitlesSSML = function() {
    return onDemandObjects.reduce(function (total, obj, index, array) {
        if (index == 1) {
            return total.ssml + ', ' + obj.ssml;
        } else if (index+1 == array.length) {
            return total + ', and ' + obj.ssml;
        } else {
            return total + ', ' + obj.ssml;
        }
    });
}
