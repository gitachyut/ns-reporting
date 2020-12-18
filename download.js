const got = require("got");
const { createWriteStream, unlinkSync } = require("fs");
const { loadXLS, addNewSheet } = require('./addSheet');
const { getRedditComments } = require('./reddit');
const { 
  initiateCommentsDownloader, 
  checkStatus 
} =  require("./export-comments");
const { resolve } = require("path");
const EXPORT_HOST = 'https://exportcomments.com/exports/';

const fileDownloads = ( remoteFile ) => new Promise((resolve, reject) => {
    let tryCount = 0;
    const downloader = (url, fileName) => {

      const downloadStream = got.stream(url);
      const fileWriterStream = createWriteStream(fileName);
      downloadStream
          .on("downloadProgress", ({ transferred, total, percent }) => {
              const percentage = Math.round(percent * 100);
              console.error(`progress: ${transferred}/${total} (${percentage}%)`);
          })
          .on("error", async (error) => {
              tryCount++;
              if(tryCount > 10){
                unlinkSync(fileName)
                reject('No comment');
              }else{
                setTimeout(()=>{
                  console.error(`Error: ${error.message}`);
                  console.error(`Try Again....`);
                  downloader(url, fileName);
                }, 2000)
              }
          });
  
      fileWriterStream
          .on("error", (error) => {
              console.log(error)
              unlinkSync(fileName)
              reject('fail to save!');
          })
          .on("finish", () => {
              console.log('Complete Download')
              resolve(`${fileName}`);
          });
  
      downloadStream.pipe(fileWriterStream);

    }

    const url = `${EXPORT_HOST}${remoteFile}`;
    const fileName = `./downloaded/${remoteFile}`;
    downloader(url, fileName);


}) 


const startDownload =  async (SML, SheetName, sheetMeta) => new Promise( async (resolve, reject) => {

    try {
      let url = new URL(SML);
      let host = url.hostname;
      let media, response;

      if(host === 'facebook.com' || host === 'www.facebook.com' || host === 'm.facebook.com')
          media = 'facebook';

      if(host === 'instagram.com' || host === 'www.instagram.com' )
          media = 'instagram';  

      if(host === 'twitter.com' || host === 'www.twitter.com' )
          media = 'twitter';

      if(host === 'youtube.com' || host === 'www.youtube.com' )
          media = 'youtube';   

      if(host === 'reddit.com' || host === 'www.reddit.com' )
          media = 'reddit';  

        
      if(media === 'facebook' || media === 'instagram' || media === 'twitter' || media === 'youtube' ){
          response = await initiateCommentsDownloader(SML, media);
          const exportLink = response.data.fileName;
          const id = response.data.id;
          setTimeout(async () => {
              const file = await fileDownloads(exportLink, id);
              loadXLS(file, SheetName, sheetMeta, media).then(r => resolve(r)).catch(e => reject(e));
          }, 3000);
      }
      
      if(media === 'reddit'){
          const values = await getRedditComments(SML);
          addNewSheet(values, SheetName, sheetMeta).then(r => resolve(r)).catch(e => reject(e));
      }else{
        // hz
      }
      
    } catch (error) {
      console.error(error);
    }
}) 

// const workSheetName = 'NHB(L) Test Dec19-Dec22';
// const SML = 'https://www.facebook.com/JalaTranslate/posts/1014646805698318';
// const SheetName = "JalaTranslate";
// const spreadsheetId = '18rq7Ykub11BEZUstzmHEsd9joGU25qGlcINyG4MZfsw';
// const sheetMeta = { 
//   spreadsheetId: spreadsheetId || null, 
//   workSheetName: null
// }

// startDownload(SML, SheetName, sheetMeta);

module.exports = {
  startDownload
}