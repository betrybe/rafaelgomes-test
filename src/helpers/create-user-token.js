const jwt = require('jsonwebtoken');

const createUserToken = async (user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user.id,
    }, 'SECRETFORCOOKMASTER');
    
    // return token
    res.status(200).json({
        token,
    });
};

module.exports = createUserToken;