let { google } = require('googleapis');
let authentication = require("./authentication");

const run = async function(auth){
    var fileId = '19zp8Yvrg0CNbjA37BWTsHrGS_9EyWAZLgJI0GAOwgeo';
    drive = google.drive({ version: "v3", auth: auth });
    const res = await drive.permissions.create({
      resource: {
        type: "user",
        role: "writer",
        emailAddress: "linkinakd72@gmail.com"  // Please set the email address you want to give the permission.
      },
      fileId: fileId,
      fields: "id",
    });
}

authentication.authenticate().then((auth)=>{
    run(auth);
});
