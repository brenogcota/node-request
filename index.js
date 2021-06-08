let fs = require('fs'),
    request = require("request");

const wget = function(uri, filename, cb) {
    request.head(uri, function(err, res, body) {
            if(err) { return console.error("error: ", err)}

            let len = parseInt(res.headers['content-length'], 10) || 0,
                 cur = 0,
                 total = len / 1048576;

            request(uri).on('response', (response) => {
                            if(response.statusCode == 200) {
                                console.log('Success: status ==', response.statusCode)
                            }
                        })
                        .on('data', (chunk) => {
                            cur += chunk.length;
                            console.log(">>> "+ (100.0 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb" + "/" + total.toFixed(2) + " mb");

                        })
                        .pipe(fs.createWriteStream(__dirname+'/assets/'+filename))
                        .on('close', cb);
    });
};

let url = 'https://pbs.twimg.com/media/EWVxurCWkAUt_Dg.jpg',
    filename = 'file-' + Date.now() + '.' + url.split('.')[url.split('.').length -1];

wget(url, filename, () => {
    console.log('done: ', filename, ' save successful.')
});