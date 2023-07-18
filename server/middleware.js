import jwt from 'jsonwebtoken';

const JWT_SECRET = "secret";

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ msg: "Missing auth header" });
  }
  const decoded = jwt.verify(authHeader, JWT_SECRET);
  if (decoded ) {
    req.USER_DETAILS=decoded.existingUser;
    next();
  } else {
    return res.status(403).json({ msg: "Incorrect token" });
  }
};

export default auth;