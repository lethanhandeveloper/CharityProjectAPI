import Exception from "../utils/Exception.js"
import HttpStatusCode from "../utils/HttpStatusCode.js"
import jwt from "jsonwebtoken"

const unauthorizedRoutes = [
    '/user/login/',
    '/user/login',
    '/user/register',
    '/user/register/'
];

export default function checkToken(req, res, next) {
    try {
        console.log(req.url.toLowerCase().trim())
        const isUnauthorizedRoute = unauthorizedRoutes.includes(req.url.toLowerCase().trim())
        console.log(isUnauthorizedRoute)
        if(isUnauthorizedRoute){
            next()
            return
        }
    
        const token = req.headers?.authorization?.split(" ")[1]
        let isExpired = ''
        if(token){
            const jwtObject = jwt.verify(token, process.env.JWT_SECRET)
            const isExpired = Date.now() >= jwtObject.exp * 1000
        }else{
            res.status(HttpStatusCode.BAD_REQUEST).json({
                message: "Token must be provided"
            })

            return
        }

        if(isExpired) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({
                message: 'Token is expired'
            })

            return
        } else {
            next()
        }
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: Exception.SERVER_ERROR
        })
    }
}