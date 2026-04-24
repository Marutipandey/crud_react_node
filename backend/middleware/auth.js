const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token)
      return res.status(401).json({ msg: "No token" });

    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };

    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
