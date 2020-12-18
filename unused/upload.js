let { google } = require('googleapis');
let authentication = require("./authentication");


function addSheet(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.create({
    auth: auth,
    resource: {
        properties:{
            title: "Add-new-shhet-01-12-2020"
        }
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Added", response.data , response.data.spreadsheetId);
    }
  });
}

authentication.authenticate().then((auth)=>{
    addSheet(auth);
});