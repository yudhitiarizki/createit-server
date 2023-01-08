const { Orders, Packages } = require('../models');
const { SendNotification } = require('./notification')
const { Api } = require('../config/payment');

const paymentOrder = async (req, res) => {
    try {
        Api.transaction.notification(req.body)
        .then(async (statusResponse)=>{
            const orderId = statusResponse.order_id;

            const updateCount = await Orders.update({status: statusResponse.transaction_status, response: JSON.stringify(statusResponse)},{
                where: {
                    orderId: orderId
                }
            });

            if (updateCount < 1){
                return res.status(400).json({
                    message: 'Payment not verify'
                })
            }

            if(statusResponse.transaction_status === 'pending'){
                SendNotification(updateCount.userId, 1, "Payment Success!")
            }

        });

        return res.status(200).json({
            message: 'Payment Successs'
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Payment not verify'
        })
    }
    
}

module.exports = { paymentOrder };