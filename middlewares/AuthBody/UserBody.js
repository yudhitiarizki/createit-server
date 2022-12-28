const { Users } = require('../../models');
const bcrypt = require("bcrypt");
const { Uploads } = require('../FileUploads')

const re_name = /^[a-zA-Z0-9 ]+$/;
const re_username = /^[a-zA-Z0-9]+$/;
const re_password = /^[a-zA-Z0-9]{2,30}$/;
const RE_HTML_ERROR = /<[\s\S]*?>/;
const re_email = /^[a-zA-Z0-9@.]+$/;


const AuthReg = async (req, res, next) => {
    const { firstName, lastName, email, username, password, repassword, phoneNumber } = req.body;

    const emailAuth = await Users.findOne({
        where: {
            email: email
        }
    }
    )

    const userAuth = await Users.findOne({
        where: {
            username: username
        }
    }
    )

    if (username) {
        if (username < 5) {
            return res.status(400).send({
                message: 'Username must be more than 4 character'
            });
        }

        if (username.search(re_username) === -1) {
            return res.status(400).send({
                message: 'Username must be Character or Number!'
            });
        }
    }


    if (firstName.match(RE_HTML_ERROR) || lastName.match(RE_HTML_ERROR) || email.match(RE_HTML_ERROR) || password.match(RE_HTML_ERROR)) {
        return res.status(400).send({
            message: 'Dont write HTML Tag on Field'
        });
    };

    if (emailAuth) {
        return res.status(412).send({
            message: 'Email has been register'
        })
    }

    if (userAuth) {
        return res.status(412).send({
            message: 'Username has been register'
        })
    }

    if (firstName.search(re_name) === -1) {
        return res.status(412).send({
            message: 'First name doesnt match with Format'
        })
    };

    if (lastName.search(re_name) === -1) {
        return res.status(412).send({
            message: 'Last name doesnt match with Format'
        })
    };

    if (password.search(re_password) === -1) {
        return res.status(412).send({
            message: 'The format of the Password does not match.',
        });
    };

    if (!email.includes('@') || email.search(re_email) === -1) {
        return res.status(412).send({
            message: 'Fill your email with real email'
        });
    };

    if (password !== repassword) {
        return res.status(412).send({
            message: 'The passwords do not match.',
        });
    };

    data_user = {
        firstName: firstName, lastName: lastName, email: email, password: password, phoneNumber: phoneNumber, username: username
    };

    next();
};

const AuthLog = async (req, res, next) => {
    const { username, password } = req.body;

    const user = await Users.findOne({
        where: {
            username: username
        }
    }
    );

    if (!user) {
        return res.status(412).send({
            message: 'Username not Registered'
        })
    };

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(400).json({ message: "Wrong Password" });
    }

    data_user = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        phoneNumber: user.phoneNumber,
        username: user.username,
        isAdmin: user.isAdmin,
        role: user.role
    }

    next()
}

const AuthRegSel = async (req, res, next) => {
    var { photoProfile, description, noRekening, bankName, cardHolder } = req.body;

    if (cardHolder.search(re_name) === -1) {
        return res.status(412).send({
            message: 'Card Holder doesnt match with Format'
        })
    };

    if (isNaN(noRekening)) {
        return res.status(400).send({
            message: 'Rekening Number must be number!'
        });
    }

    if (photoProfile.match(RE_HTML_ERROR) || cardHolder.match(RE_HTML_ERROR) || noRekening.match(RE_HTML_ERROR) || bankName.match(RE_HTML_ERROR)) {
        return res.status(400).send({
            message: 'Dont write HTML Tag on Field'
        });
    };


    photoProfile = req.protocol + '://' + req.get('host') + '/' + Uploads(photoProfile, 'images');

    data_reg = {
        photoProfile, description, noRekening, bankName, cardHolder
    }

    next();
}

module.exports = { AuthReg, AuthLog, AuthRegSel };