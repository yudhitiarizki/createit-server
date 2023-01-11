const midtransClient = require('midtrans-client');
// Create Core API instance
const Api = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'SB-Mid-server-umN3nQFbcCFox84QCboJvD-j',
        clientKey : 'SB-Mid-client-kUsxGWKUctqAIxm9'
    });

const Parameter = ( orderId, paymentMethod, bankName, user, package ) => {

    const banktf = (bankName) => {
        return {
            payment_type: "bank_transfer",
            transaction_details: {
                gross_amount: package.price,
                order_id: orderId,
            },
            customer_details: {
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                phone: user.phoneNumber
            },
            item_details: [
                {
                    id: package.packageId,
                    price: package.price,
                    quantity: 1,
                    name: package.Service.title
                }
            ],
            bank_transfer:{
                bank: bankName
            }
        }
    }

    const eBank = (bankName) => {
        return {
            payment_type: bankName,
            transaction_details: {
                gross_amount: package.price,
                order_id: orderId,
            },
            customer_details: {
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                phone: user.phoneNumber
            },
            item_details: [
                {
                    id: package.packageId,
                    price: package.price,
                    quantity: 1,
                    name: package.Service.title
                }
            ]
        }
    }

    if (paymentMethod === 'bank_transfer'){
        return banktf(bankName)
    } else {
        const paymenttf = eBank(bankName);
        if(paymentMethod === 'bca_klikpay'){
            paymenttf.bca_klikpay = {
                description: package.Service.title
            }
            return paymenttf;
        } else if ( paymentMethod === 'cimb_clicks' ) {
            paymenttf.cimb_clicks = {
                description: package.Service.title
            }
            return paymenttf;
        }
        return paymenttf
    }
};

module.exports = { Api, Parameter }