import HttpStatusCode from "../utils/HttpStatusCode.js"
import Exception from "../utils/Exception.js"
import { Commune, District, Province, User } from "../models/index.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phoneNumber,
            gender,
            age,
            communeId,
            specificAddress
    
        } = req.body

        const existingUser = await User.findOne({ $or : [
            {email : email},
            {phoneNumber, phoneNumber}
        ]}).exec()

        if(existingUser) {
            res.json(HttpStatusCode.CONFLICT).json({
                message: "Email or phonenumber is exists already"
            })
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 1,
            phoneNumber,
            gender,
            age,
            communeId,
            specificAddress
        })

        res.status(HttpStatusCode.OK).json({
            message: "Register successfully",
            data: {
                ...newUser._doc,
                password: "not show"
            }
        })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(Exception.SERVER_ERROR)
    }
}

const login = async (req, res) => {
    try {
        const {
            useraccount,
            password
        } = req.body

        console.log(req.body)
        let existingUser = await User.findOne({$or : [
            {email : useraccount},
            {phoneNumber: useraccount }
        ]}).exec()
    
        if(existingUser) {
            console.log("password" +password)
            console.log("epss"+ existingUser)
            let isMatch = await bcrypt.compare(password, existingUser.password)
            let token = "";
            if(isMatch){
                token = jwt.sign({
                    data: {
                        ...existingUser,
                        password: "not show"
                    }
                }, process.env.JWT_SECRET,
                {
                    expiresIn: '30 days'
                }
                )
            }

            res.status(200).json({
                message: 'Login user successfully',
                data: {
                    ...existingUser.toObject(),
                    password: "not show",
                    token: token 
                }
            })

           
        }else{
            res.status(HttpStatusCode.UNAUTHORIZED).json({
                message: "User is not exists"
            })
        }
        
    } catch (error) {
        console.log(error)
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Server is error",
            data: error
        })
    }
    
}

const getMyUserInfo = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            console.log(typeof(decoded.data._doc._id))
            const user = await User.findById(decoded.data._doc._id).exec();
            const commune = await Commune.findById(user.communeId).exec()
            const district =  await District.findById(commune.districtId).exec()
            const province = await Province.findById(district.provinceId).exec()

            res.status(HttpStatusCode.OK).json({
                message: 'Get my user info successfully',
                data: {
                    ...user._doc,
                    commune: commune.name,
                    district: district.name,
                    province: province.name
                }
            })
        });
    } catch (error) {
       res.status(HttpStatusCode.SERVER_ERROR).json({
        message: Exception.SERVER_ERROR
       })
    }
   
}

export default {
    register,
    login,
    getMyUserInfo
}