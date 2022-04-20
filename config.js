//Add scripts that you wish to run in succession here using the ./fileName seperated by commas.
const scripts = ['./getUserID', './addUserToGroup'].map(require);

let input = {
    payload: null,
    environment: null,

    //configure your environment variables here in JSON format.
    secrets: JSON.parse('{"apiKey":"XXXXXX"}'),

    //configure the incoming request here including the url, method, headers, and body in JSON format. This will emulate the BetterCloud Action (Webhook) that you are debugging.
    request: JSON.parse('{"url": "https://yourURl", "method": "POST", "headers": {"Accept":"application/json", "Content-Type":"application/json"}, "body":{"email":"test@user.com"}}')
};

let callback = function (webhookRequest) {
    input.request = webhookRequest;
};

let error = function (name) {
    console.log("Failed: " + name);
};

async function executeWebhook(request) {
    const axios = require('axios');

    let rebuiltRequest = {
        url: request.url,
        method: request.method,
        headers: request.headers,
        data: request.body
    };

    axios(rebuiltRequest).then(response => {
        console.log("Webhook Request: " + JSON.stringify(rebuiltRequest));
        console.log("Webhook Response: " + JSON.stringify(response.data));
    }).catch(err => {
        console.log("Webhook Request Error: " + err)
    })
}

async function forOf() {
    let result = [];
    for (const script of scripts) {
        result.push(await script(input, callback, error))
    }
    return executeWebhook(input.request);
}

forOf();
