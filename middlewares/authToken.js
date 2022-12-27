const jwt = require("jsonwebtoken");
require('dotenv').config();

const AuthToken = (req, res, next) => {
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
            data_user = {
                userId: decoded.userId,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                username: decoded.username,
                email: decoded.email,
                roles: decoded.roles,
                phoneNumber: decoded.phoneNumber
            }
            next();
        });

    } catch (err) {
        return res.status(403).send({
            message: 'This feature requires login.',
        });
    }
    
}

module.exports = AuthToken;