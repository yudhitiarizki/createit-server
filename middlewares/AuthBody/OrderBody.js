const { Packages, Services, Sellers } = require('../../models');
const { Uploads } = require('../FileUploads');

const RE_HTML_ERROR = /<[\s\S]*?>/; 

const AuthOrder = async (req, res, next) => {
    var { packageId, note, paymentMethod, bankName } = req.body;

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
    
    data_order = {
        packageId, note, paymentMethod, status: "Waiting payment", revisionLeft: package.revision , bankName
    };

    data_seller = seller;

    next();
}

module.exports = { AuthOrder }