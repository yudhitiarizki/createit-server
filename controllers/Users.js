const { Users, Sellers, Notifications, Services, Orders, Packages, Reviews, sequelize } = require('../models');
const { VerifyEmail, EmailToken } = require('./VerifyEmail')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SendNotification } = require('./notification');
require('dotenv').config();

const approveSeller = async (req, res) => {
    try {
        const { userId } = req.body

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
            message: 'Seller has been Verified!'
        });

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to verify Seller',
        });
    }

}

const rejectSeller = async (req, res) => {
    try {
        const { userId } = req.body;

        const updateCount = await Users.update(
            { role: 1 },
            { where: {
                userId: userId
            }})
        
        if (updateCount < 1){
            return res.status(400).json({
                message: 'Reject not completed!'
            })
        }

        const rejectCount = await Sellers.destroy(
            { where: { 
                userId: userId 
            }}
        );

        if (rejectCount < 1){
            return res.status(400).json({
                message: 'Reject not completed!'
            })
        }

        SendNotification(userId, 1, "Your seller apply is reject. Please try again later!");

        return res.status(200).json({ 
            message: 'Seller has been Rejected!'
        });

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
            message: 'Failed to reject Seller',
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
            role: 1,
            verified: false
        });

        const token = EmailToken(user.email)

        VerifyEmail(user.email, token)

        res.json({message: "Register Successfully, Check your email to verify!"});
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Register',
        });
    };
};

const Login = async (req, res) => {
    try {
        const { userId, firstName, lastName, email, password, seller, phoneNumber, username, role } = data_user;
        
        const accessToken = jwt.sign({ userId, firstName, lastName, email, password, phoneNumber, username, role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '7d'
        });

        const refreshToken = jwt.sign({ userId, firstName, lastName, email, password, phoneNumber, username, role }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await Users.update({ refreshToken: refreshToken }, {
            where: {
                userId: userId
            },
        });

        res.status(200).json({ userId, firstName, lastName, email, phoneNumber, username, seller, role, accessToken });

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
            },
            where: {
                isVerified: 0
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
            where: {
                isVerified: 0
            },
            include: {
                model: Users
            }
        });

        const data = seller.map( seller  => {
            const { userId, sellerId, photoProfile, description, createdAt } = seller;
            const { firstName, lastName, username } = seller.User

            return { userId, sellerId, photoProfile, description, createdAt, firstName, lastName, username }
        })

        return res.status(200).json({
            data: data
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Fetch Seller',
        });
    }
}

const findTotalOrder = (listObj) => {
    let totalOrder = 0;
    for (let i = 0; i < listObj.length; i++) {
      totalOrder += listObj[i].dataValues.noOfBuyer;
    }
    return totalOrder;
  }

const detailSeller = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const seller = await Sellers.findOne({ 
            where : { sellerId: sellerId },
            include: [{ 
                model: Users,
                attributes: ['firstName', 'lastName', 'userId'] 
            }, {
                model: Services,
                include: {
                    model: Reviews,
                },
                attributes: ['serviceId', 'sellerId', 'categoryId', 'title', 'description', 'slug', 
                    [sequelize.fn('AVG', sequelize.col('rating')), 'ratingService'],
                    [sequelize.fn('COUNT', sequelize.col('reviewId')), 'noOfBuyer']
                ]
            }],
            attributes: ['photoProfile', 'description', 'sellerId', 'createdAt', [sequelize.fn('COUNT', sequelize.col('Services.serviceId')), 'serviceSold']]
        })

        const totalRating = seller.Services.reduce((sum, rating) => sum + rating.dataValues.ratingService, 0)
        const averageRating = totalRating / seller.Services.length ;

        const data = () => {
            const { photoProfile, description, sellerId, createdAt, serviceSold } = seller.dataValues;
            const { firstName, lastName, userId } = seller.User;
            const rating = averageRating;
            const noOfBuyer = findTotalOrder(seller.Services);

            return { photoProfile, userId, description, sellerId, createdAt, serviceSold, firstName, lastName, rating, noOfBuyer  }
        }

        return res.status(200).json({
            data: data()
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

module.exports = { Register, Login, RegSeller, getUsers, getSeller, detailSeller, detailMySeller, approveSeller, rejectSeller };