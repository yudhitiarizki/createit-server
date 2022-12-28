const { Service } = require('../../models')

const RE_HTML_ERROR = /<[\s\S]*?>/; 

const CreateSlug = (input) => {
    var slug = input.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    slug = slug + '-' + Date.now();

    return slug;
}

const AuthService = async (req, res, next) => {
    const { title, description, categoryId } = req.body;

    if( title.match(RE_HTML_ERROR) ){
        return res.status(400).send({
            message: 'Dont write HTML Tag on Field'
        });
    };

    const slug = CreateSlug(title)

    data_service = { title, description, categoryId, slug };

    next()
}

module.exports = { AuthService }
