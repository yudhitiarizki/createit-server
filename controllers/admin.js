const { Sellers, OrderFiles, ServiceImages} = require('../models');
const { SendNotification } = require('./notification');

const approveSeller = async (req, res) => {
    const userId = req.body.userId
    try {
        const aprove = await Sellers.update(
            { isVerified: 1 },
            { where: { userId: userId } }
        );
        if (aprove == 1) {
            SendNotification(userId, 1, "Your seller account is verified.");
        }
        res.status(200).json({ message: 'Seller has been verified' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const migrate = async (req, res) => {
    try {
        const service = await ServiceImages.findAll();

        service.forEach(async (serv) => {
            let url = serv.image;
            let pathname = new URL(url).pathname;
            let filename = pathname.split("/").pop();
            const image = req.protocol + '://' + req.get('host') + '/public/uploads/images/' + filename
            await ServiceImages.update({image}, {where: {
                imageId: serv.imageId
            }})
        });

        const profile = await Sellers.findAll();
        profile.forEach(async (prof) => {
            let url = prof.photoProfile;
            let pathname = new URL(url).pathname;
            let filename = pathname.split("/").pop();
            const photoProfile = req.protocol + '://' + req.get('host') + '/public/uploads/images/' + filename
            await Sellers.update({photoProfile}, {
                where: {
                    sellerId: prof.sellerId
                }
            })
        })

        const file = await OrderFiles.findAll();
        file.forEach(async (fl) => {
            if(fl.upldFileType === 1){
                let url = fl.file;
                let pathname = new URL(url).pathname;
                let filename = pathname.split("/").pop();
                const file = req.protocol + '://' + req.get('host') + '/public/uploads/files/' + filename;
                await OrderFiles.update({file}, {
                    where: {
                        fileId: fl.fileId
                    }
                })
            }
        })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { approveSeller, migrate };