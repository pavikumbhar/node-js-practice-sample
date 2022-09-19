const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
    //GET the user from jwt token and add the id to req object

    const token = req.header('auth-token');
    if (!token) {
        console.log('req.header not available ');
        return res.status(401).send({ error: 'Please authenticate using valid token' });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();

    } catch (error) {
        console.error(error.message);
        res.status(401).send({ error: 'Please authenticate using valid token' });
    }

}

module.exports = fetchUser;