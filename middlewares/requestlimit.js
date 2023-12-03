import Exception from "../utils/Exception.js";
import HttpStatusCode from "../utils/HttpStatusCode.js";
import requestIp from 'request-ip';
import { RequestLimit } from "../models/index.js";

export default async function requestLimit(req, res, next) {
  try {
    const currentClientIp = requestIp.getClientIp(req); 
    const currentRoute = req.originalUrl;
    const rqLimit = await RequestLimit.findOne({ route: currentRoute, clientIp: currentClientIp, nextRequestAt: { $gte: Date.now() } })
    console.log(Date.now())
    console.log(rqLimit)
    if(rqLimit){
        
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: `You can only get the code every ${process.env.REGISTRATION_EXPIRED_AFTER_MINUTES} minutes`
        })
        return
    }
    next()
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: Exception.SERVER_ERROR
    })
  }
}


