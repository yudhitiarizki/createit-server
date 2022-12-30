const { Packages, Services, Sellers } = require('../../models');
const { Uploads } = require('../FileUploads');

const RE_HTML_ERROR = /<[\s\S]*?>/; 

const AuthOrder = async (req, res, next) => {
    var { packageId, note, paymentProof } = req.body;

    if( note.match(RE_HTML_ERROR) ){
        return res.status(400).send({
            message: 'Dont write HTML Tag on Field'
        });
    };

    const package = await Packages.findOne({
        where: {
            packageId: packageId
        },
        include: {
            model: Services,
            include: {
                model: Sellers,
            }
        }
    })

    const seller = package.Service.Seller;

    paymentProof = req.protocol + '://' + req.get('host') + '/' + Uploads(paymentProof, 'images');
    
    data_order = {
        packageId, note, paymentProof, status: "Checking payment", revisionLeft: package.revision 
    };

    data_seller = seller;

    next();
}

module.exports = { AuthOrder }