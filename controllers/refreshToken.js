const { Users } = require('../models');
const jwt = require("jsonwebtoken");


const refreshToken = async (req, res) => {
    try {
        const { userId, firstName, lastName, email, password, phoneNumber, username, isAdmin } = data_user;
        
        const accessToken = jwt.sign({ userId, firstName, lastName, email, password, phoneNumber, username, isAdmin }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '7d'
        });

        const refreshToken = jwt.sign({ userId, firstName, lastName, email, password, phoneNumber, username, isAdmin }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await Users.update({ refreshToken: refreshToken }, {
            where: {
                userId: userId
            }
        });

        res.json({ accessToken });

    } catch (error) {
        console.log(error)
    }
}

module.exports = refreshToken;