const { Orders, Packages, Services, Sellers, Users, OrderFiles, OrderNotes } = require('../models');
const { Op } = require('sequelize');
const { SendNotification } = require('./notification');
const { Uploads } = require('../middlewares/FileUploads')


const createOrder = async (req, res) => {
    try {
        const { packageId, note, paymentProof, status, revisionLeft } = data_order
        const userIdSeller = data_seller.userId;
        const { userId } = data_user;

        await Orders.create({
            userId, packageId, note, paymentProof, status, revisionLeft
        })

        SendNotification(userIdSeller, 3, "There is new order. Check the payment");

        return res.status(200).json({
            message: 'Order has been created!'
        })

        
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
            include: {
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
                
            } 
        });


        const order = orders.map((order) => {
            const { firstName, lastName } = order.Package.Service.Seller.User;
            const { title } = order.Package.Service;
            const { type } = order.Package;
            const { note, status, revisionLeft } = order;

            return { firstName, lastName, title, type, note, status, revisionLeft }
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
        const { orderId, status } = req.body;

        const updateCount = await Orders.update({status}, {
            where: {
                orderId: orderId
            }
        });

        if (updateCount < 1){
            return res.status(401).json({
                message: 'Order not update'
            });
        };

        SendNotification(1, 3, "Buyer finished it's order. Please transfer the money to seller.");

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
                status: "Checking payment"
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
            include: {
                model: Packages,
                include: {
                    model: Services,
                    include: {
                        model: Sellers,
                        include: {
                            model: Users
                        }
                    }
                } 
            } 
        });

        const order = orders.map((order) => {
            const { firstName, lastName, username } = order.Package.Service.Seller.User;
            const { noRekening, bankName, cardHolder } = order.Package.Service.Seller
            const { title } = order.Package.Service;
            const { type, price } = order.Package;
            const { orderId } = order; 

            return { orderId, username, firstName, lastName, title, type, price, noRekening, bankName, cardHolder }
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
        const orders = await Orders.findAll({
            where: {
                status: "Pending"
            },
            include: [{
                model: Packages,
                include: {
                    model: Services,
                } 
            }, {
                model: Users
            }]
        });

        const order = orders.map((order) => {
            const { title } = order.Package.Service;
            const { type, delivery, revision, noOfConcept, noOfPages, maxDuration, price } = order.Package;
            const { username, firstName, lastName } = order.User
            const { orderId, userId, note } = order; 

            return { orderId, userId, username, firstName, lastName, title, type, delivery, revision, noOfConcept, noOfPages, maxDuration, price, note }
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
        const orders = await Orders.findAll({
            where: {
                status: {
                    [Op.or]: ["Revising", "Working"]
                }
            },
            include: [{
                model: Users
            },{
                model: Packages,
                include: {
                    model: Services
                }
            }, {
                model: OrderNotes
            }]
        });

        const order = orders.map((order) => {
            const { title } = order.Package.Service;
            const { type, delivery, revision, noOfConcept, noOfPages, maxDuration } = order.Package;
            const { username, firstName, lastName } = order.User
            const { orderId, userId, note } = order; 
            const orderNotes = order.OrderNotes;

            return { orderId, userId, username, firstName, lastName, title, type, delivery, revision, noOfConcept, noOfPages, maxDuration, note, orderNotes }
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
        var { orderId, file } = req.body;

        file = req.protocol + '://' + req.get('host') + '/' + Uploads(file, 'files');

        await OrderFiles.create({ orderId, file });

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