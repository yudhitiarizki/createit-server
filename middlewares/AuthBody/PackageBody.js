const { Packages } = require('../../models')

const RE_HTML_ERROR = /<[\s\S]*?>/; 

const isNumeric = (str) => {
  return /^\d+$/.test(str);
}

const AuthPackage = async (req, res, next) => {
    var { serviceId, type, delivery, revision, noOfConcept, noOfPages, maxDuration, price } = req.body;

    
    if( type.match(RE_HTML_ERROR) ){
        return res.status(400).send({
            message: 'Dont write HTML Tag on Field'
        });
    };

    if (delivery && !isNumeric(delivery)) {
        return res.status(400).json({
            message: 'Delivery must number!'
        })
    }

    if (revision && !isNumeric(revision)) {
        return res.status(400).json({
            message: 'Revision must number!'
        })
    }
    
    if (noOfConcept && !isNumeric(noOfConcept)) {
        return res.status(400).json({
            message: 'Number of Concept must number!'
        })
    }

    if (noOfPages && !isNumeric(noOfPages)) {
        return res.status(400).json({
            message: 'Number of Pages must number!'
        })
    }

    if (maxDuration && !isNumeric(maxDuration)) {
        return res.status(400).json({
            message: 'Max Duration must number!'
        })
    }

    if (price && !isNumeric(price)) {
        return res.status(400).json({
            message: 'Price must number!'
        })
    }

    data_package = { serviceId, type, delivery, revision, noOfConcept, noOfPages, maxDuration, price };

    next();
}

module.exports = { AuthPackage }