// Simple Email Service of AWS

const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

module.exports.sendEmail = function (recipient, message, subject) {
    ses.sendEmail({
        Source: "Nisarg Mewada <abrasive.gazelle@spicedling.email>",
        Destination: {
            ToAddresses: [recipient],
        },
        Message: {
            Body: {
                Text: {
                    Data:
                        message,
                },
            },
            Subject: {
                Data: subject,
            },
        },
    })
        .promise()
        .then(() => console.log("it worked!"))
        .catch((err) => console.log(err));
};
