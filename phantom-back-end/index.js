const speech = require('@google-cloud/speech');
const fs = require('fs');
const admin = require('firebase-admin');
const execSync = require('child_process').execSync;
const express = require('express')
const bodyParser = require('body-parser')

const PORT = 3000;
const remoteBucketURL = "gs://silicon-alpha-220717.appspot.com"

const getSummary = require("./components/getSummary")
const email = require('./components/email/email')

const processText = getSummary.processText

const app = express()
app.use(bodyParser.json())


var serviceAccount = require('./auth/firestore.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const storage = admin.storage().bucket(remoteBucketURL);
const client = new speech.SpeechClient();

function exec(cmd) {
    execSync(cmd)
}

function downloadFile(filename, callback = () => {}) {
    const localFilename = `${filename}`;
    const remoteFile = storage.file(filename)

    remoteFile.createReadStream()
        .on('error', function (err) {})
        .on('response', function (response) {
            // Server connected and responded with the specified status and headers.
        })
        .on('end', function () {
            // The file is fully downloaded.
            callback();
        })
        .pipe(fs.createWriteStream(localFilename));
}

function getDataPromise(fileName) {

    const formattedFileName = "formatted_file.flac";
    const fileFormatCommand = `ffmpeg -ss 0 -t 60 -i ${fileName} -ac 1 ${formattedFileName} 2> ffmpeg-convert.log`;

    exec(fileFormatCommand);

    const file = fs.readFileSync(formattedFileName);
    const audioBytes = file.toString('base64');
    fs.unlinkSync(formattedFileName);
    fs.unlinkSync(fileName);

    const audio = {
        content: audioBytes,
    };
    const config = {
        languageCode: 'en-US',
        useEnhanced: true,
        model: 'phone_call',
        enableWordTimeOffsets: true,
    };
    const request = {
        audio: audio,
        config: config,
    };


    return client.recognize(request)
}

async function getText(fileName) {
    let data = await getDataPromise(fileName);

    const response = data[0];
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

    return transcription
}


async function downloadLocal(cloudFileName) {
    downloadFile(cloudFileName, async () => {
        console.log(await getText(cloudFileName))
    })
}



app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next()
})


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function main() {

    let rand = getRndInteger(1, 3);

    let filename;

    if (rand == 0)
        filename = "new7.m4a";
    else
        filename = "new8.m4a";

    downloadFile(filename, async () => {
        let str = await getText(filename);

        console.log(str)

        email.emailTranscript(new Date().toISOString(), str, 'aneeshsaripalli@gmail.com');

        let result = await processText(str)

        console.log(result)

        return true
    })
}

app.post('/', (req, res) => {

    let rand = getRndInteger(1, 3);

    let fname;

    if (rand == 1)
        fname = "new7.m4a";
    else
        fname = "new8.m4a";


    console.log("--> Client side post request received.")
    const body = req.body;

    const reqType = body['request'];

    if (reqType === "transcript") {
        downloadFile(fname, async function () {
            const transcript = await getText(fname);
            let summary = await processText(transcript);

            const transObj = {
                transcript: transcript,
                summary: summary
            }

            let stringSend = JSON.stringify(transObj)
            console.log(stringSend)

            email.emailTranscript(new Date().toISOString(), transcript, 'aneeshsaripalli@gmail.com');
            res.send(stringSend)
        })
    } else {
        const empty = {
            transcript: ""
        }

        res.send(JSON.stringify(empty))
    }
})

app.listen(PORT, () => {})