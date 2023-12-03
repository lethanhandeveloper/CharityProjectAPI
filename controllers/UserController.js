import HttpStatusCode from "../utils/HttpStatusCode.js";
import Exception from "../utils/Exception.js";
import { Commune, District, Province, User, EmailRegistrationCode, RequestLimit } from "../models/index.js";
import { sendRegistionCodeEmail } from "../services/Email.js";
import requestIp from 'request-ip';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const isUserExists = async ({ email, phoneNumber, userName }) => {
  const existingUser = await User.exists({
    $or: [{ email }, { phoneNumber }, { userName }],
  });

  return existingUser;
};

const isValidRgCode = async (email, rgCode) => {
  return await EmailRegistrationCode.exists({ email, rgCode, expiredAt : { $gte : Date.now() } })
}

const register = async (req, res) => {
  try {
    const {
      name,
      userName,
      email,
      password,
      phoneNumber,
      gender,
      age,
      communeId,
      specificAddress,
      image_url,
      rgCode
    } = req.body;

    if(!await isValidRgCode(email, rgCode)){
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Registration code is not valid or expired. Please try again",
      })
      return
    }
    
    if (await isUserExists({ email, phoneNumber, userName })) {
      res.status(HttpStatusCode.CONFLICT).json({
        message: "Email or phone number is exists already",
      })
      return
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    )

    const newUser = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
      role: 1,
      phoneNumber,
      gender,
      age,
      communeId,
      specificAddress,
      image_url,
    });

    res.status(HttpStatusCode.OK).json({
      message: "Register successfully",
      result: {
        ...newUser._doc,
        password: "not show",
      },
    });

    return;
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(Exception.SERVER_ERROR);
  }
};

const login = async (req, res) => {
  try {
    const { useraccount, password } = req.body;

    console.log(req.body);
    let existingUser = await User.findOne({
      $or: [{ email: useraccount }, { phoneNumber: useraccount }],
    }).exec();

    if (existingUser) {
      console.log("password" + password);
      console.log("epss" + existingUser);
      let isMatch = await bcrypt.compare(password, existingUser.password);

      if (isMatch) {
        const payLoad = {
          data: {
            ...existingUser,
            password: "not show",
          },
        };
        let accessToken = jwt.sign(payLoad, process.env.JWT_SECRET, {
          expiresIn: "5d",
        });
        let refreshToken = jwt.sign(payLoad, process.env.JWT_REFRESH, {
          expiresIn: "30d",
        });

        res.status(200).json({
          message: "Login user successfully",
          result: {
            ...existingUser.toObject(),
            password: "not show",
            token: accessToken,
          },
        });
      }
    } else {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "User is not exists",
      });
    }
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
      result: error,
    });
  }
};

const getMyUserInfo = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      const user = await User.findById(decoded.data._doc._id).exec();
      const commune = await Commune.findById(user.communeId).exec();
      const district = await District.findById(commune.districtId).exec();
      const province = await Province.findById(district.provinceId).exec();

      res.status(HttpStatusCode.OK).json({
        message: "Get my user info successfully",
        result: {
          ...user._doc,
          commune: commune.name,
          district: district.name,
          province: province.name,
        },
      });
    });
  } catch (error) {
    res.status(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const updateMyUserInfo = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    const {
      name,
      email,
      phoneNumber,
      gender,
      age,
      communeId,
      specificAddress,
    } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      const userId = decoded.data._doc._id;
      const user = await User.findById(userId);
      if (email !== user.email || phoneNumber !== user.phoneNumber)
        if (await isUserExists({ email, phoneNumber })) {
          res.status(HttpStatusCode.CONFLICT).json({
            message: "Email or phone number existed in the system",
          });

          return;
        }
      try {
        await User.findByIdAndUpdate(
          userId,
          {
            name,
            email,
            phoneNumber,
            gender,
            age,
            communeId,
            specificAddress,
          },
          { new: true }
        );

        res.status(HttpStatusCode.OK).json({
          message: "Update user info successfully",
        });
      } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "User info is not valid",
        });
      }

      return;
    });
  } catch (error) {
    res.status(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    const { image_url } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      const userId = decoded.data._doc._id;

      try {
        await User.findByIdAndUpdate(
          userId,
          {
            image_url,
          },
          { new: true }
        );

        res.status(HttpStatusCode.OK).json({
          message: "Update user info successfully",
        });
      } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "User info is not valid",
        });
      }

      return;
    });
  } catch (error) {
    res.status(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const getUserListByPage = async (req, res) => {
  try {
    const UserList = await User.find().exec();
    res.status(HttpStatusCode.OK).json({
      result: UserList,
    });
  } catch (error) {
    res.status(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const getUserInActiveListByPage = async (req, res) => {
  try {
    const UserList = await User.find().exec();
    res.status(HttpStatusCode.OK).json({
      result: UserList,
    });
  } catch (error) {
    res.status(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const sendRegistionCode = async (req, res) => {
  try {
    const { toEmail } = req.body
    const rgcode = await sendRegistionCodeEmail(toEmail);
    const expiredAt = Date.now() + process.env.REGISTRATION_EXPIRED_AFTER_MINUTES * 60 * 1000;

    let ergcode = await EmailRegistrationCode.findOne({ email: toEmail })
    if(ergcode){
      ergcode.rgCode = rgcode
      ergcode.expiredAt = expiredAt

      ergcode.save()
    }else{
      EmailRegistrationCode.create({ 
        email: toEmail,
        rgCode: rgcode,
        expiredAt: expiredAt
      })
    }

    const clientIp = requestIp.getClientIp(req); 
    let rqLimit = await RequestLimit.findOne({ route: "/user/register/getcode", clientIp })
    if(rqLimit){
      rqLimit.nextRequestAt = expiredAt
      await rqLimit.save()
    }else{
      await RequestLimit.create({ route: "/user/register/getcode", clientIp, nextRequestAt : expiredAt })
    }

    res.status(200).json({
      "message": "Send registration code mail successfully"
    })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Server is error" })
  }
}

export default {
  register,
  login,
  getMyUserInfo,
  updateMyUserInfo,
  updateAvatar,
  getUserListByPage,
  getUserInActiveListByPage,
  sendRegistionCode
};
