const { Users, Sellers, Notifications } = require('../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SendNotification } = require('./notification');
require('dotenv').config();

const approveSeller = async (req, res) => {
    try {
        const userId = req.body.userId

        const updateCount = await Sellers.update(
            { isVerified: 1 },
            { where: { 
                userId: userId 
            }}
        );

        if (updateCount < 1){
            return res.status(400).json({
                message: 'Users not yet verify! please try again later'
            })
        }

        SendNotification(userId, 1, "Your seller account is verified.");

        return res.status(200).json({ 
            message: 'uhuy'
        });

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to verify Seller',
        });
    }

}

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

        const exist = await Sellers.findOne({
            where: {
                userId: userId
            }
        })

        if (exist) {
            return res.status(400).json({
                message: 'You have registered become Seller!'
            })
        }

        await Users.update({role: 2}, {
            where: {
                userId: userId
            }
        })

        const seller = await Sellers.create({
            userId, photoProfile, description, noRekening, bankName, cardHolder, isVerified: 0
        });

        const user = await Users.findOne({
            where: userId
        });

        const { firstName, lastName, email, password, phoneNumber, username, role } = user;

        const accessToken = jwt.sign({ userId, firstName, lastName, email, password, phoneNumber, username, role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '7d'
        });

        return res.status(200).json({
            message: 'Sucesss! Seller Registered',
            data: {
                firstName, lastName, email, phoneNumber, username, role, seller, accessToken
            }
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

const detailSeller = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const seller = await Sellers.findOne({ 
            where : { sellerId: sellerId },
            include: { 
                model: Users,
                attributes: ['firstName', 'lastName'] 
            },
            attributes: ['photoProfile', 'description']
        })

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

const detailMySeller = async (req, res) => {
    try {
        const { userId, firstName, lastName, username, email, role, phoneNumber, seller, sellerId } = data_user;

        return res.status(200).json({
            data : {
                userId, firstName, lastName, username, email, role, phoneNumber, seller, sellerId
            }
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Fetch Seller',
        });
    }
}

module.exports = { Register, Login, RegSeller, getUsers, getSeller, detailSeller, detailMySeller, approveSeller };