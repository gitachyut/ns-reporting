const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { startDownload } = require('./download');
const app = new express();
// Response body parser
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


// Cors setup
app.use(cors())

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
    next();
});


app.post('/comment-scrap', (req,res)=>{
    const {
        url,
        sheetName,
        spreadsheetId,
        workSheetName
    } = req.body;

    const sheetMeta = { 
      spreadsheetId: spreadsheetId,
      workSheetName:  workSheetName || null
    }

    // console.log(url, sheetName, sheetMeta)

    startDownload(url, sheetName, sheetMeta)
        .then(( res) => {
            res.json({
                done: true
            }); 
        }) 
        .catch(err => res.json({
            fail: true
        }))
    
})

module.exports = app;
