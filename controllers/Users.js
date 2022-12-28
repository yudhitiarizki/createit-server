const { Users, Sellers, Notifications } = require('../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const notifications = require('../models/notifications');
require('dotenv').config();

const Register = async (req, res) => {
    const user = data_user;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(user.password, salt);

    try {
        const NewUser = await Users.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber, 
            username: user.username,
            password: hashPassword,
            role: 1
        })

        res.json({message: "Register Successfully"});
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Register',
        });
    };
};

const Login = async (req, res) => {
    try {
        const { userId, firstName, lastName, email, password, phoneNumber, username, role } = data_user;

        var seller = '';
        
        const accessToken = jwt.sign({ userId, firstName, lastName, email, password, phoneNumber, username, role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '7d'
        });

        const refreshToken = jwt.sign({ userId, firstName, lastName, email, password, phoneNumber, username, role }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await Users.update({ refreshToken: refreshToken }, {
            where: {
                userId: userId
            }
        });

        if (role === 2) {
            seller = await Sellers.findOne({
                where: {
                    userId: userId
                }
            })
        }

        res.json({ userId, firstName, lastName, email, phoneNumber, username, seller, accessToken });

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

        await Users.update({role: 2}, {
            where: {
                userId: userId
            }
        })

        await Sellers.create({
            userId, photoProfile, description, noRekening, bankName, cardHolder, isVerified: 0
        });

        return res.status(200).json({
            message: 'Sucesss! Seller Registered'
        })

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Register Seller',
        });
    }
    
}

const getUsers = async (req, res) => {
    try {
        var user = await Users.findAll({
            include: {
                model: Sellers
            }
        });


        return res.json({
            data: user
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Fetch User',
        });
    }
}

const getSeller = async (req, res) => {
    try {
        var seller = await Sellers.findAll({
            include: {
                model: Users
            }
        });

        return res.status(200).json({
            data: seller
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Fetch Seller',
        });
    }
}

module.exports = { Register, Login, RegSeller, getUsers, getSeller };