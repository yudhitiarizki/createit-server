const jwt = require("jsonwebtoken");
const { Sellers } = require('../models')
require('dotenv').config();

const AuthSeller = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
    
        const [tokenType, tokenValue] = authHeader.split(' ');

        if (tokenType !== 'Bearer') {
            return res.status(403).send({
                message: 'An error occurred in the forwarded Authorization',
            });
        }

        if (tokenValue == null) {
            return res.status(401).send({
                message: 'An error occurred in the forwarded Authorization'
            })
        };
        
        jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);

            if(decoded.role !== 1) {
                return res.status(400).json({
                    message: 'You must be seller!'
                })
            }
            
            const seller = await Sellers.findOne({
                where: {
                    userId: decoded.userId
                }
            })
            
            data_user = {
                userId: decoded.userId,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                username: decoded.username,
                email: decoded.email,
                role: decoded.role,
                phoneNumber: decoded.phoneNumber,
                seller: seller
            }
            next();
        });

    } catch (err) {
        return res.status(403).send({
            message: 'This feature requires login.',
        });
    }
    
}

module.exports = AuthSeller;