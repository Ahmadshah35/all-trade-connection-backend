const jwt = require("jsonwebtoken");
const userModel = require("../models/userProfile");
const proModel = require("../models/proProfile");

const userAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];

      const { type, _id } = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

      if (type === "User") {
        req.user = await userModel.findById(_id).select("-password");
      } else if (type === "Professional") {
        req.user = await proModel.findById(_id).select("-password");
      } else {
        return res.status(400).json({
          status: "failed",
          message: "Invalid user type in token",
        });
      }

      if (!req.user) {
        return res.status(401).json({
          status: "failed",
          message: "User not found",
        });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized: Invalid or expired token",
      });
    }
  } else {
    return res.status(400).json({
      status: "failed",
      message: "Unauthorized: No token provided",
    });
  }
};

module.exports = userAuth;
