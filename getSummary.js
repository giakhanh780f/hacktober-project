const NLU_MODULE = require('watson-developer-cloud/natural-language-understanding/v1.js');

let str = "thank you for calling T-Mobile this is Patrick\nhello I am having issues with Cellular Connection here in Austin\nokay let me check the service that is over there\nall right so after checking it appears Austin is all right are you getting any signal on your phone or do\nyou have no bars at all I have none at all\nall right did you check that cellular data is turned on in your settings I have checked and there's on\nall right then you you'll have to bring your phone into a local T-Mobile store to get it fixed\nall right thank you\nyou're welcome have a nice day\n";

const bluemix_auth = require('./auth/bluemix.json')

const nlu = new NLU_MODULE(bluemix_auth);

function getSummary(keywords, keywordsScore, str) {
    let issueSummary = "Issues: \n";
    let solSummary = "\nSolutions: \n";
    for(var i = 0; i < keywords.length; i++){
        /*if((keywordsScore[i] == 0){
            
        }*/
        if(keywordsScore[i] < 0){ 
            var splitStr = str.split('\n');
            splitStr.forEach(element => {

                if(element.includes(keywords[i]) && !issueSummary.includes(keywords[i])) {
                    issueSummary += element + "\n";                    
                } 
            })
            str.indexOf(keywords[i]);
        }
        else if(keywordsScore[i] > 0) {
            //positive
            var splitStr = str.split('\n');
            splitStr.forEach(element => {
                if(element.includes(keywords[i]) && !solSummary.includes(keywords[i])) {
                    solSummary += element + "\n";                    
                } 
            })
            str.indexOf(keywords[i]);
        }
    }

    /*
    let jsonObj = JSON.parse(element);
    jsonObj.relations.forEach(word => {
        
    })*/
    return issueSummary + solSummary;
}

function findNewLine(str, startIndex) {
    for (let i = startIndex; i < str.length; i++) {
        if (str.charAt(i) == '\n') return i;
    }
    return -1;
}

/*DO NOT TOUCH*/
// this function is literally dynamite. no touchy.
async function processText(inputText) {
    let analysis_array = []

    let ctr = 0;
    let sentences = inputText.split("\n")
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
            nlu.analyze(parameters, async function (err, response) {
                if (err) {
                    console.log('error:', err);
                } else {
                    var jsonResult = JSON.stringify(response, null, 2);

                    ctr++;
                    analysis_array.push(jsonResult)

                    if (ctr === sentences.length - 1) {
                        doAnalysis(analysis_array)
                    }
                }
            });

        }
    }
}

/**
 * Array is the processed array of json objects.
 * Do whatever the fuck you want with it.
 */
function doAnalysis(array) {
    var keywords = [];
    var keywordsScore = [];
    var avg;
    var total = 0;
    array.forEach(element => {
        let jsonObj = JSON.parse(element)

       // keyswords is an array
       // console.log(jsonObj.keywords)
       let average = 0;
        jsonObj.keywords.forEach(word => {
            total += word.sentiment.score;
            let text = word.text
            let score = word.sentiment.score
            let label = word.sentiment.label
            let relevance = word.sentiment.relevance                                              

            console.log(text, score, label, relevance);
            keywords.push(text);
            keywordsScore.push(score);
        })
        
    })
    average = (total / array.length);
    console.log("Average value: " + average);
    console.log(getSummary(keywords, keywordsScore, str));
}

processText(str)