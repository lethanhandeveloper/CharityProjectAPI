import Exception from "../utils/Exception.js";
import HttpStatusCode from "../utils/HttpStatusCode.js";
import jwt from "jsonwebtoken";


export default function checkToken(req, res, next) {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    let isExpired
    let jwtObject

    if (token) {
      jwtObject = jwt.verify(token, process.env.JWT_SECRET)
      const isExpired = Date.now() >= jwtObject.exp * 1000
    } else {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Token must be provided",
      });

      return
    }

    if (isExpired) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "Token is expired",
      })

      return

    } else {
      next()
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "Token is not valid"
      })

      return
    }
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    })
  }
}



