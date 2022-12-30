const { Packages, Orders } = require('../../models')

const RE_HTML_ERROR = /<[\s\S]*?>/; 

const isNumeric = (str) => {
  return /^\d+$/.test(str);
}

const AuthReview = async (req, res, next) => {
    const { orderId, review, rating } = req.body;

    if( review.match(RE_HTML_ERROR) ){
        return res.status(400).send({
            message: 'Dont write HTML Tag on Field'
        });
    };

    if ( rating && !isNumeric(rating) ) {
        return res.status(400).json({
            message: 'Rating must number!'
        })
    }

    data_review = { orderId, review, rating };

    next();
}


module.exports = { AuthReview };
