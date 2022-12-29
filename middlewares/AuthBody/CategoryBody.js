
const { Categories } = require('../../models');
const { Uploads } = require('../FileUploads');

const RE_HTML_ERROR = /<[\s\S]*?>/; 

const AuthCategory = async (req, res, next) => {
    var { category, description, image } = req.body;

    if( category.match(RE_HTML_ERROR) ){
        return res.status(400).send({
            message: 'Dont write HTML Tag on Field'
        });
    };

    category = category.toLowerCase()
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');
    
    image = req.protocol + '://' + req.get('host') + '/' + Uploads(image, 'images');

    data_category = { category, description, image };

    next()
}

module.exports = { AuthCategory }