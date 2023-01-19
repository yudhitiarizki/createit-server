const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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

const reduceImage = (data) =>  {
    let parts = data.split(';');
    let mimType = parts[0].split(':')[1];
    let imageData = parts[1].split(',')[1];

    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    const type = matches[1];

    var img = Buffer.from(imageData, 'base64');

    if (type == 'image/png'){
        return sharp(img)
        .png({compressionLevel: 8})
        .toBuffer()
        .then(resizedImageBuffer => {
            let resizedImageData = resizedImageBuffer.toString('base64');
            let resizedBase64 = `data:${mimType};base64,${resizedImageData}`;
            return resizedBase64;
        })
        .catch(error => {
            // error handeling
            console.log(error)
        })
    } else if (type == 'image/jpg' || type == 'image/jpeg'){
        return sharp(img)
        .jpeg({quality: 80})
        .toBuffer()
        .then(resizedImageBuffer => {
            let resizedImageData = resizedImageBuffer.toString('base64');
            let resizedBase64 = `data:${mimType};base64,${resizedImageData}`;
            return resizedBase64;
        })
        .catch(error => {
            // error handeling
            console.log(error)
        })
    } else if (type == 'image/webp'){
        return sharp(img)
        .webp({quality: 80})
        .toBuffer()
        .then(resizedImageBuffer => {
            let resizedImageData = resizedImageBuffer.toString('base64');
            let resizedBase64 = `data:${mimType};base64,${resizedImageData}`;
            return resizedBase64;
        })
        .catch(error => {
            // error handeling
            console.log(error)
        })
    } else {
        return sharp(img)
        .toBuffer()
        .then(resizedImageBuffer => {
            let resizedImageData = resizedImageBuffer.toString('base64');
            let resizedBase64 = `data:${mimType};base64,${resizedImageData}`;
            return resizedBase64;
        })
        .catch(error => {
            // error handeling
            console.log(error)
        })
    }
    
}

function calc_image_size(image) {
    let y = 1;
    if (image.endsWith('==')) {
        y = 2
    }
    const x_size = (image.length * (3 / 4)) - y
    return Math.round(x_size / 1024)
}


const Uploads = async (data, directory) => {
    const filedata = await reduceImage(data);

    console.log("old data : ", calc_image_size(data))
    console.log("new data : ", calc_image_size(filedata))


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