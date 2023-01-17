const fs = require('fs');
const path = require('path');

function decodeBase64Image(dataString) {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
  
    return response;
  }


const Uploads = (data, directory) => {
    const filedata = data;

    // Panggil fungsi decodeBase64Image untuk mendecode data "image"
    const decData = decodeBase64Image(filedata);

    // Tentukan nama file dan tipe file
    const fileName = directory + '-' + Date.now() + '.' + decData.type.split('/')[1];
    const filePath = 'public/uploads/' + directory +'/' + fileName;

    // Tulis file ke dalam folder "public/uploads"
    fs.writeFile(filePath, decData.data, (error) => {
        if (error) {
            return next(error);
        }
    });

    return filePath;
}

const uploadFileRar = (data, Name) => {
    const file = data;
    const buffer = Buffer.from(file, 'base64');
    const fileExtension = path.extname(Name);
    const fileName = 'public/uploads/files/'+ 'files' + '-' + Date.now() + fileExtension;

    fs.writeFileSync(fileName, buffer, (error) => {
        if (error) {
            console.log(error);
        }
    });

    return fileName;
}
  
module.exports = { Uploads, uploadFileRar };