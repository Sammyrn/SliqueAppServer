const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    //console.log('token', req.headers.authorization)
   // console.log(req)
    if (!token) {
        return res.status(403).json({ message: 'No access token provided!' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access token expired', code: 'TOKEN_EXPIRED' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid access token' });
        }
        return res.status(400).json({ message: err.message });
      }
}

exports.verifyToken = verifyToken;