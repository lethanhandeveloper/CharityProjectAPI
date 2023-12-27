import Exception from "../utils/Exception.js";
import HttpStatusCode from "../utils/HttpStatusCode.js";
import User from '../models/User.js'
import jwt from "jsonwebtoken";

export default function auth(roles) {
  return async (req, res, next) => {
    try {
      const token = req.headers?.authorization?.split(" ")[1];
      let isExpired;
      let role;
      let jwtObject;

      if (token) {
        jwtObject = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(jwtObject.data._doc._id)
        console.log(user)
        if(user.isActive == false){
          return res.status(HttpStatusCode.FORBIDDEN).json({
            message: "Your account is deactived. Please contact with admin for get more information"
          })
        }
        isExpired = Date.now() >= jwtObject.exp * 1000
      } else {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Token must be provided",
        });
      }

      if (isExpired) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Token is expired",
        });

      } else {
        if (!roles.includes(jwtObject.data._doc.role)) {
          return res.status(HttpStatusCode.FORBIDDEN).json({
            message: "Your request is banned",
          });
        }

        next();
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Token is expired",
        });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Token is not valid",
        });
      }

      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: Exception.SERVER_ERROR,
      });
    }
  };
}
