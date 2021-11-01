const getToken = (req) => {
    const token = req.headers.authorization;
    
    return token;
};

module.exports = getToken;