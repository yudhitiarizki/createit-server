const fs = require('fs');

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

function processRequest(req, res, next, fieldName='image', dir='image') {

    if(!req.body[fieldName]) { next() }
    // Ambil data "image" dari file JSON
    const imageData = req.body[fieldName];

    // Panggil fungsi decodeBase64Image untuk mendecode data "image"
    const image = decodeBase64Image(imageData);

    // Tentukan nama file dan tipe file
    const fileName = 'image-' + Date.now() + '.' + image.type.split('/')[1];
    const filePath = 'public/uploads/' + dir +'/' + fileName;

    // Tulis file ke dalam folder "public/uploads"
    fs.writeFile(filePath, image.data, (error) => {
        if (error) {
            return next(error);
        }
    });

    req.body.fileName = req.protocol + '://' + req.get('host') + '/' + filePath

    // Lanjutkan ke middleware berikutnya
    next();
};


  
module.exports = processRequest;