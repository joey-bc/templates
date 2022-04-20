const axios = require('axios');
let secrets;

async function getUserId(email, encodedAuthKey, error) {
    const getUserRequest = {
        method: 'GET', // replace this with your endpoint method
        url: `https://${secrets.yourAppsSubDomain}.yourappsbaseurl.com/api/v2/users?email=${email}`, // replace this with your endpoint url
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${encodedAuthKey}`
        }
    };

    try {
        const response = await axios(getUserRequest);
        const users = response.data.users ? response.data.users : []; // replace this with the resource path in the response
        const matchingUser = users.find(user => user.email ? user.email.toLowerCase() === email.toLowerCase() : false); // replace this if you want to match on something else other than email
        return matchingUser ? matchingUser.id : error(`Indeterminate amount of users found for email ${email}`); // here you can resolve something else other than matchingUser.id
    } catch (err) {
        error(err);
    }
}

module.exports = async(input, callback, error) => {
    secrets = input.secrets;
    const request = input.request;
    const encodedAuthKey = new Buffer.from(`${secrets.auth_username}:${secrets.auth_password}`).toString('base64');
    // this supports the basic auth username & password configured when setting up a new integration

    try {
        const userId = await getUserId(request.body.email, encodedAuthKey, error);
        request.url = request.url.replace('{userId}', userId);
        callback(request);  // calls back this request to the url to delete the user
    } catch (err) {
        error(err);
    }
};
