const { Users, Sellers } = require('../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
require('dotenv').config();

const Register = async (req, res) => {
    const user = data_user;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(user.password, salt);

    try {
        await Users.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber, 
            username: user.username,
            password: hashPassword,
            isAdmin: 0
        });
        res.json({message: "Register Successfully"});
    } catch (err) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Register',
        });
    };
};

const Login = async (req, res) => {
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

        res.json({ userId, firstName, lastName, email, phoneNumber, username, accessToken });

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Login',
        });
    };
};

const RegSeller = async (req, res) => {
    try {
        const { userId } = data_user;
        const { photoProfile, description, noRekening, bankName, cardHolder } = data_reg;

        const seller = await Sellers.findOne({
            where: {
                userId: userId
            }
        })

        if (seller) {
            return res.status(400).json({
                message: 'You have registered become Seller!'
            })
        }

        await Sellers.create({
            userId, photoProfile, description, noRekening, bankName, cardHolder
        })

    } catch (error) {
        
    }
    
}

module.exports = { Register, Login };