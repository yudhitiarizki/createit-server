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

function image(req, res, next) {
    
    if(req.body.image){
        // Ambil data "image" dari file JSON
        const imageData = req.body.image;

        // Panggil fungsi decodeBase64Image untuk mendecode data "image"
        const image = decodeBase64Image(imageData);

        // Tentukan nama file dan tipe file
        const fileName = 'images-' + Date.now() + '.' + image.type.split('/')[1];
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
    }
    next()
};


function file(req, res, next) {
    
    if(req.body.files){
        // Ambil data "image" dari file JSON
        const imageData = req.body.files;

        // Panggil fungsi decodeBase64Image untuk mendecode data "image"
        const image = decodeBase64Image(imageData);

        // Tentukan nama file dan tipe file
        const fileName = 'files-' + Date.now() + '.' + image.type.split('/')[1];
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
    }
    next()
};


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
  
module.exports = { image, file, Uploads };