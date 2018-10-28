const NLU_MODULE = require('watson-developer-cloud/natural-language-understanding/v1.js');

// let str =
//     "thank you for calling T-Mobile this is Patrick, how may I help you\n" +
//     "Howdy, my daughter's phone was dropped into the toilet\n" + // Issue
//     "Where are you located and what kind of phone does you daughter have?\n" + // Issue
//     "I live in Chicago and my daughter has the iPhone 7\n" +
//     "Alright, well the Apple Store will be better equipped to assist you.\n" +
//     "Ok, thanks for your help\n" +
//     "You're welcome thank you for calling T-Mobile have a nice day\n";

const bluemix_auth = require('../auth/bluemix.json')

const nlu = new NLU_MODULE(bluemix_auth);

//keywords is array of all the keywords, is parallel to keywordScore array which holds the given score for each keyword
function getSummary(keywords, keywordsScore, str, location) {

    console.log("Beginning summary creation.")

    let issueSummary = "Issues: \n";
    let solSummary = "Solutions: \n";
    //Situation, Duration
    for (var i = 0; i < keywords.length; i++) {
        if (keywordsScore[i] < 0) { //negative score
            var splitStr = str.split('\n');
            splitStr.forEach(element => {

                if (element.includes(keywords[i]) && !issueSummary.includes(keywords[i])) {
                    issueSummary += element + "\n";
                }
            })
            str.indexOf(keywords[i]);
        } else if (keywordsScore[i] > 0) { //positive score
            var splitStr = str.split('\n');
            splitStr.forEach(element => {
                if (element.includes(keywords[i]) && !solSummary.includes(keywords[i]) && !issueSummary.includes(keywords[i])) {
                    if (!element.includes("thank"))
                        solSummary += element + "\n";
                }
            })
            str.indexOf(keywords[i]);
        }
    }
    var summaries = [issueSummary, solSummary, location];

    console.log("Finished summary creation.")

    return summaries;
}

/*DO NOT TOUCH*/
// this function is literally dynamite. no touchy.
function processText(inputText) {
    let analysis_array = []

    let ctr = 0;
    let sentences = inputText.split("\n")

    return new Promise((resolve, reject) => {
        for (let i = 0; i < sentences.length; i++) {
            let sentence = sentences[i]

            if (sentence.length !== 0) {
                var parameters = {
                    'text': sentence,
                    'features': {
                        'relations': {},
                        'entities': {
                            'emotion': true,
                            'sentiment': true,
                            'limit': 10
                        },
                        'keywords': {
                            'emotion': true,
                            'sentiment': true,
                            'limit': 100
                        }
                    }
                }
                nlu.analyze(parameters, function (err, response) {
                    if (err) {
                        console.log('error:', err);
                    } else {
                        var jsonResult = JSON.stringify(response, null, 2);

                        ctr++;
                        analysis_array.push(jsonResult)

                        if (ctr === sentences.length - 1) {
                            console.log("Watson processing complete. Now doing feature extraction.")
                            resolve(doAnalysis(analysis_array))
                        }
                    }
                });
            }
        }
    });
}


//Array is the processed array of json objects.
function doAnalysis(array) {
    console.log("Beginning analysis.")
    var keywords = [];
    var keywordsScore = [];
    var location = [];
    var avg;
    var total = 0;
    array.forEach(element => {
        let jsonObj = JSON.parse(element);
        let average = 0;
        jsonObj.keywords.forEach(word => {
            total += word.sentiment.score;
            let text = word.text;
            let score = word.sentiment.score;
            let label = word.sentiment.label;
            let relevance = word.sentiment.relevance;
            //let anger = word.emotion.anger
            //let joy = word.emotion.joy;
            keywords.push(text);
            keywordsScore.push(score);
        })
        jsonObj.entities.forEach(word => {
            if (word.type == "Location" && !location.includes(word.text))
                location.push(word.text);
        })
    })
    average = (total / array.length);

    console.log("String parsing over. Going to summary creation.")

    let str = ""
    array.forEach(word => str = str + word)


    return getSummary(keywords, keywordsScore, str, location);
}


module.exports = {
    processText
}