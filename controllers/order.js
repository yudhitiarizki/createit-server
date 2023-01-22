const { Orders, Packages, Services, Sellers, Users, OrderFiles, OrderNotes, ServiceImages } = require('../models');
const { Op } = require('sequelize');
const { SendNotification } = require('./notification');
const { uploadFileRar } = require('../middlewares/FileUploads');
const { Api, Parameter } = require('../config/payment')

const createOrder = async (req, res) => {
    try {
        const { packageId, note, paymentMethod, bankName, status, revisionLeft } = data_order
        const userIdSeller = data_seller.userId;
        const { userId } = data_user;

        const { orderId } = await Orders.create({ userId, packageId, note, paymentMethod, status, revisionLeft });

        const package = await Packages.findOne({ where: { packageId: packageId }, include: { model: Services } })

        const param = Parameter(orderId, paymentMethod, bankName, data_user, package);

        Api.charge(param).then(async (chargeResponse) => {
            console.log('chargeResponse:',JSON.stringify(chargeResponse));
            await Orders.update({response: JSON.stringify(chargeResponse)}, { where: { orderId: orderId }}); 

            SendNotification(userId, 1, "Order has been created! please pay first");
            SendNotification(userIdSeller, 2,  "Request Order Here!");

            return res.status(200).json({
                message: 'Order has been created!',
                data: chargeResponse
            });
        })
        .catch(async (error) => {
            await Orders.destroy({ where: { orderId: orderId } })

            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            return res.status(400).json({ message: 'Failed to create orders', });
        });
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to create orders',
        });
    }
}

const getOrderUser = async (req, res) => {
    try {
        const { userId } = data_user;

        const orders = await Orders.findAll({
            where: {
                userId
            },
            include: [{
                model: Packages,
                include: {
                    model: Services,
                    include: {
                        model: Sellers,
                        include: {
                            model: Users,
                            attributes: ['firstName', 'lastName']
                        }
                    }
                }
            }, {
                model: OrderFiles,
                order: ['createdAt', 'DESC'],
            }, {
                model: OrderNotes,
                order: ['createdAt', 'DESC'],
            }] 
        });


        const order = orders.map((order) => {
            const { firstName, lastName } = order.Package.Service.Seller.User;
            const { title } = order.Package.Service;
            const { type, price } = order.Package;
            const { note, status, revisionLeft, response, createdAt, updatedAt, delivery, orderId, OrderFiles, OrderNotes} = order;

            return { orderId, firstName, lastName, title, type, price, note, status, updatedAt, delivery, revisionLeft, response, createdAt, OrderFiles, OrderNotes }
        })

        return res.status(200).json({
            data: order
        })
        
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to retrive orders',
        });
    }
};

const getDetailOrder = async (req, res) => {
    try {
        const { orderId } = req.params

        const order = await Orders.findOne({
            where: {
                orderId: orderId
            },
            include: [{
                model: Packages,
                include: {
                    model: Services,
                    include: {
                        model: Sellers,
                        include: {
                            model: Users,
                            attributes: ['firstName', 'lastName']
                        }
                    }
                }
                
            }, {
                model: OrderNotes
            }, {
                model: OrderFiles
            }] 
        });


        const { firstName, lastName } = order.Package.Service.Seller.User;
        const { title } = order.Package.Service;
        const { type, price, delivery } = order.Package;
        const { note, status, revisionLeft } = order; 
        const orderNotes = order.OrderNotes;
        const orderFiles = order.OrderFiles;

        return res.status(200).json({
            data: { firstName, lastName, title, type, note, status, revisionLeft, price, delivery, orderNotes, orderFiles}
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to retrive orders',
        });
    }
}

const approveOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const updateCount = await Orders.update({status: 'Approved'}, {
            where: {
                orderId: orderId
            }
        });

        if (updateCount < 1){
            return res.status(401).json({
                message: 'Order not update'
            });
        };

        SendNotification(2, 3, "Buyer finished it's order. Please transfer the money to seller.");

        res.status(200).json({
            message: 'Order Approved'
        });

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to approve orders',
        });
    }
}

const revision = async (req, res) => {
    try {
        const { orderId, note } = req.body;
        const status = "Revising";

        const order = await Orders.findOne({
            where: {
                orderId: orderId
            },
            include: {
                model: Packages,
                include: {
                    model: Services,
                    include: {
                        model: Sellers
                    }
                }
                
            } 
        });


        if(order.revisionLeft < 1){
            return res.status(400).json({
                message: "Can't ask for revision. Number of revision already reach it's maximum limit."
            })
        };

        const revisionLeft = order.revisionLeft - 1;

        const updateCount = await Orders.update({status, revisionLeft},{
            where: {
                orderId: orderId
            }
        });

        if (updateCount < 1){
            return res.status(401).json({
                message: 'Revision not sending'
            });
        };

        await OrderNotes.create({
            orderId, note
        });
        
        const { userId } = order.Package.Service.Seller;

        SendNotification(userId, 2, `Revision for Order ID ${orderId}`);

        return res.status(200).json({
            message: 'Success for send revision'
        });
        
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to approve orders',
        });
    }
};

const getOrderPayment = async (req, res) => {
    try {
        const order = await Orders.findAll({
            where: {
                status: "Waiting payment"
            }
        });

        return res.status(200).json({
            data: order
        });
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to retrive orders',
        });
    }
};

const orderVerif = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Orders.findOne({
            where: { orderId: orderId },
            include: {
                model: Packages,
                include: {
                    model: Services,
                    include: {
                        model: Sellers
                    }
                }
                
            } 
        });

        const updateCount = await Orders.update({status: "Pending"},{
            where:{ orderId: orderId }
        });

        if (updateCount < 1){
            return res.status(401).json({
                message: 'Failed to Approve'
            });
        };

        const { userId } = order.Package.Service.Seller;
        
        SendNotification(userId, 2, "New Order");

        return res.status(200).json({
            message: "Orders has been approved!"
        })
        
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to approve orders',
        });
    }
};

const getOrderApprove = async (req, res) => {
    try {
        const orders = await Orders.findAll({
            where: {
                status: "Approved"
            },
            include: [{
                model: Packages,
                include: {
                    model: Services,
                    include: [{
                        model: Sellers,
                        include: {
                            model: Users
                        }
                    }, {
                        model: ServiceImages
                    }]
                } 
            }, {
                model: Users
            }]
        });

        const order = orders.map((order) => {
            const { firstName, lastName, username } = order.Package.Service.Seller.User;
            const { noRekening, bankName, cardHolder } = order.Package.Service.Seller
            const { title } = order.Package.Service;
            const { image } = order.Package.Service.ServiceImages[0];
            const { type, price } = order.Package;
            const { orderId, updatedAt, delivery, createdAt } = order;
            const User = order.User;

            return { orderId, username, firstName, lastName, updatedAt, delivery, title, type, price, noRekening, bankName, cardHolder, image, createdAt, User }
        });

        return res.status(200).json({
            data: order
        })

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to retrive orders',
        });
    }
};

const orderDone = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Orders.findOne({
            where: { orderId: orderId },
            include: {
                model: Packages,
                include: {
                    model: Services,
                    include: {
                        model: Sellers
                    }
                }
                
            } 
        });

        const updateCount = await Orders.update({status: "Done"},{
            where:{ orderId: orderId }
        });

        if (updateCount < 1){
            return res.status(401).json({
                message: 'Failed to done'
            });
        };

        const { userId } = order.Package.Service.Seller;

        SendNotification(userId, 2, `Order #${orderId} has done!`);

        return res.status(200).json({
            message: "Order has done!"
        })

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to done orders',
        });
    }
};

const getOrderPending = async (req, res) => {
    try {
        const { sellerId } = data_user;
        
        const seller = await Services.findAll({
            where: {
                sellerId: sellerId
            },
            attributes: ['serviceId'],
            include: {
                model: Packages,
                attributes: ['serviceId', 'packageId'],
            }
        })


        const  packageId = [];

        seller.map(or => {
            const x = or.Packages.map(y => {
                packageId.push(y.packageId)
                return y.packageId
            });
            return x
        })
        
        const orders = await Orders.findAll({
            where: {
                [Op.and]: [{status: 'settlement'}, {packageId: {
                    [Op.or]: packageId
                }}]
            },
            include: [{
                model: Packages,
                include: {
                    model: Services,
                    include: [{
                        model: ServiceImages
                    }]
                } 
            }, {
                model: Users
            }]
        });

        const order = orders.map((order) => {
            const { title, } = order.Package.Service;
            const image = order.Package.Service.ServiceImages[0].image;
            const { type, delivery, revision, noOfConcept, noOfPages, maxDuration, price } = order.Package;
            const { username, firstName, lastName } = order.User
            const { orderId, userId, note, updatedAt, createdAt } = order; 

            return { orderId, userId, image, username, firstName, lastName, updatedAt, title, type, delivery, revision, noOfConcept, noOfPages, maxDuration, price, note, createdAt }
        });

        return res.status(200).json({
            data: order
        })

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to retrive orders',
        });
    }
};

const orderWorking = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Orders.findOne({
            where: { orderId: orderId } 
        });

        const updateCount = await Orders.update({status: "Working"},{
            where:{ orderId: orderId }
        });

        if (updateCount < 1){
            return res.status(401).json({
                message: 'Failed to working'
            });
        };

        const { userId } = order;

        SendNotification(userId, 1, `Order #${orderId} has Working!`);

        return res.status(200).json({
            message: "Order has Working!"
        })

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to Working orders',
        });
    }
};

const progressOrder = async (req, res) => {
    try {
        const { sellerId } = data_user;
        
        const seller = await Services.findAll({
            where: {
                sellerId: sellerId
            },
            attributes: ['serviceId'],
            include: {
                model: Packages,
                attributes: ['serviceId', 'packageId'],
            }
        })


        const  packageId = [];

        seller.map(or => {
            const x = or.Packages.map(y => {
                packageId.push(y.packageId)
                return y.packageId
            });
            return x
        })


        const orders = await Orders.findAll({
            where: {
                [Op.and]: [
                    {status: {[Op.or]: ["Revising", "Working", "Reviewing"]}}, 
                    {packageId: {[Op.or]: packageId}}
                ]
            },
            include: [{
                model: Users
            },{
                model: Packages,
                include: {
                    model: Services,
                    include: {
                        model: ServiceImages
                    }
                }
            }, {
                model: OrderFiles,
                order: ['createdAt', 'DESC'],
            }, {
                model: OrderNotes,
                order: ['createdAt', 'DESC'],
            }]
        });

        const order = orders.map((order) => {
            const { title } = order.Package.Service;
            const image = order.Package.Service.ServiceImages[0].image;
            const { type, delivery, revision, noOfConcept, noOfPages, maxDuration } = order.Package;
            const { username, firstName, lastName } = order.User
            const { orderId, userId, note, createdAt, status, updatedAt, OrderNotes, OrderFiles } = order; 

            return { orderId, userId, image, username, firstName, lastName, title, type, status, delivery, revision, noOfConcept, noOfPages, maxDuration, note, OrderNotes, OrderFiles, createdAt, updatedAt }
        })

        return res.status(200).json({
            data: order
        })
        
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to retrive orders',
        });
    }
}

const uploadFile = async (req, res) => {
    try {
        var { orderId, upldFileType, fileName } = req.body;

        if (upldFileType === 1){
            const file = req.protocol + '://' + req.get('host') + '/' + uploadFileRar(req.body.file, fileName);
            await OrderFiles.create({ orderId, upldFileType, file });
        } else {
            const { file } = req.body;
            await OrderFiles.create({ orderId, upldFileType, file });
        }

        const order = await Orders.findOne({
            where: { orderId: orderId } 
        });

        const updateCount = await Orders.update({status: "Reviewing"},{
            where:{ orderId: orderId }
        });

        if (updateCount < 1){
            return res.status(401).json({
                message: 'Failed to Reviewing'
            });
        };

        const { userId } = order;

        SendNotification(userId, 1, `Order #${orderId} completed, please Review!`);

        return res.status(200).json({
            message: "Success to upload file"
        })
        
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to uploads',
        });
    }
}

module.exports = { createOrder, getOrderUser, getDetailOrder, approveOrder, revision, getOrderPayment, orderVerif, getOrderApprove, orderDone, getOrderPending, orderWorking, progressOrder, uploadFile };