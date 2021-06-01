const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;
    // This process is async
    const promise = s3
        // We will use putObject to upload the images on AWS
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise(); //putObject return a promise.

    promise
        .then(() => {
            // it worked!!!
            console.log("Amazon upload complete..!!");
            // fs.unlink(path, () => {}); //(Optional)// This will delete the image from the upload folder
            next();
        })
        .catch((err) => {
            // uh oh
            console.log("err in s3 upload put Object", err);
            res.sendStatus(404);
        });
};
exports.delete = (imgUrl) => {
    return s3
        .deleteObject({ Bucket: "spicedling", Key: imgUrl })
        .promise()
        .then(() => {
            console.log("File deleted successfully");
        });
};
