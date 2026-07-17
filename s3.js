const fs = require('fs');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    try {
        secrets = require('./secrets'); // secrets.json is in .gitignore
    } catch (e) {
        secrets = null; // no AWS credentials - keep uploads on local disk
    }
}

if (!secrets || !secrets.AWS_KEY || !secrets.AWS_SECRET) {
    console.log('No AWS credentials found - storing uploads locally in /uploads');
    exports.upload = function(req, res, next) {
        if (!req.file) {
            return res.json({
                error: true
            });
        }
        next();
    };
    return;
}

const knox = require('knox');

const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'spicedling'
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        return res.json({
            error: true
        });
    }

    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype, //headers that amazon usees when serving files
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });

    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);
    s3Request.on('response', s3Response => {
        console.log('s3 status: ', s3Response);
        if (s3Response.statusCode == 200) {
            next();
            // fs.unlink(req.file.path, () => 0);
        } else {
            return res.json({
                error: true
            });
        }
    });
};
