import HttpStatusCode from "../utils/HttpStatusCode.js";
import Exception from "../utils/Exception.js";
import {
  Commune,
  District,
  Province,
  User,
  EmailRegistrationCode,
  RequestLimit,
  PhoneNumberCode,
} from "../models/index.js";
import { sendRegistionCodeEmail } from "../services/Email.js";
import requestIp from "request-ip";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import { generateRandomCode } from "../utils/Number.js";

const isUserExists = async ({ email, phoneNumber, userName }) => {
  const existingUser = await User.exists({
    $or: [{ email }, { phoneNumber }, { userName }],
  });

  return existingUser;
};

const isValidRgCode = async (email, rgCode) => {
  return await EmailRegistrationCode.exists({
    email,
    rgCode,
    expiredAt: { $gte: Date.now() },
  });
};

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
      rgCode,
    } = req.body;

    if (!(await isValidRgCode(email, rgCode))) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Registration code is not valid or expired. Please try again",
      });
      return;
    }

    if (await isUserExists({ email, phoneNumber, userName })) {
      res.status(HttpStatusCode.CONFLICT).json({
        message: "Email or phone number or username is exists already",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

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
      isActive: true,
      createdDate: Date.now(),
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

    let existingUser = await User.findOne({
      $or: [{ email: useraccount }, { phoneNumber: useraccount }],
    }).exec();

    if (existingUser) {
      let isMatch = await bcrypt.compare(password, existingUser.password);

      if (isMatch) {
        if (existingUser.isActive === false) {
          return res.status(HttpStatusCode.FORBIDDEN).json({
            message:
              "Your account is deactived. Please contact with admin for get more information",
          });
        }

        const payLoad = {
          data: {
            ...existingUser,
            password: "not show",
          },
        };

        let accessToken = jwt.sign(payLoad, process.env.JWT_SECRET, {
          expiresIn: "1d",
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

            refreshToken,
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
const setActive = async (req, res) => {
  try {
    const { id, isActive } = req.body;
    await User.findByIdAndUpdate(id, {
      isActive,
    });

    res.status(HttpStatusCode.OK).json({
      message: "Update user info successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "User info is not valid",
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
    const { toEmail } = req.body;
    const rgcode = await sendRegistionCodeEmail(toEmail);
    const expiredAt =
      Date.now() + process.env.REGISTRATION_EXPIRED_AFTER_MINUTES * 60 * 1000;

    let ergcode = await EmailRegistrationCode.findOne({ email: toEmail });
    if (ergcode) {
      ergcode.rgCode = rgcode;
      ergcode.expiredAt = expiredAt;

      ergcode.save();
    } else {
      EmailRegistrationCode.create({
        email: toEmail,
        rgCode: rgcode,
        expiredAt: expiredAt,
      });
    }

    const clientIp = requestIp.getClientIp(req);
    let rqLimit = await RequestLimit.findOne({
      route: "/user/register/getcode",
      clientIp,
    });
    if (rqLimit) {
      rqLimit.nextRequestAt = expiredAt;
      await rqLimit.save();
    } else {
      await RequestLimit.create({
        route: "/user/register/getcode",
        clientIp,
        nextRequestAt: expiredAt,
      });
    }

    res.status(200).json({
      message: "Send registration code mail successfully",
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Server is error" });
  }
};

const getAccessToken = async (req, res) => {
  try {
    const refreshToken = req.headers?.authorization?.split(" ")[1];
    let isExpired;
    let jwtObject;

    if (refreshToken) {
      jwtObject = await jwt.verify(refreshToken, process.env.JWT_REFRESH);

      isExpired = Date.now() >= jwtObject.exp * 1000;
    } else {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Refresh token must be provided",
      });

      return;
    }

    if (isExpired) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "Refresh token is expired",
      });
    }

    const payLoad = {
      data: {
        ...jwtObject.data,
        password: "not show",
      },
    };

    let accessToken = jwt.sign(payLoad, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(HttpStatusCode.OK).json({
      token: accessToken,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "Refresh token is not valid",
      });

      return;
    }

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const getHomePageUser = async (req, res) => {
  try {
    const users = await User.find({ $or: [{ role: 2 }, { role: 3 }] }).exec();
    const returnUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      age: user.age,
      image_url: user.image_url,
      charityAccountNumber: user.charityAccountNumber,
      createdDate: user.createdDate,
    }));

    return res.status(HttpStatusCode.OK).json({
      message: "Get home user succesfully",
      result: returnUsers,
    });
  } catch (error) {
    return res.status(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const countUser = async (req, res) => {
  try {
    const UserList = await User.count();
    res.status(HttpStatusCode.OK).json({
      result: UserList,
    });
  } catch (error) {
    res.status(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const getUserByName = async (req, res) => {
  try {
    const name = req.params.name;
    const users = await User.find({ name: new RegExp(name, "i") });
    res.status(HttpStatusCode.OK).json({
      message: "Get all Users successfully",
      result: users,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};
const getUserByID = async (req, res) => {
  try {
    const id = req.params.id;
    const users = await User.findById(id);
    res.status(HttpStatusCode.OK).json({
      message: "Get all Users successfully",
      result: users,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const validatePhoneNumber = async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;
    const phonenocode = await PhoneNumberCode.findOne({ phoneNumber, code });

    if (!phonenocode) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Your request data is not valid",
      });
    } else {
    }
  } catch (error) {
    return res.status(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const getPhoneNumberCode = async (req, res) => {
  try {
    const client = twilio(
      process.env.ACCOUNT_ID_TWILIO,
      process.env.AUTH_TOKEN_TWILIO
    );
    const code = generateRandomCode();
    const { phoneNumber } = req.body;
    const expiredAt =
      Date.now() + process.env.PHONENO_CODE_EXPIRED_AFTER_MINUTES * 60 * 1000;

    let phonenocode = await PhoneNumberCode.findOne({ phoneNumber });
    if (phonenocode) {
      phonenocode.code = code;
      phonenocode.expiredAt = expiredAt;

      phonenocode.save();
    } else {
      PhoneNumberCode.create({
        phoneNumber: phoneNumber ?? process.env.PHONE_NO_CODE_DEFAULT,
        code: code,
        expiredAt: expiredAt,
      });
    }

    client.messages

      .create({
        from: "+12056712883",
        body: "Your email code validation is " + code,
        to: "+84337464921",
      })
      .then((message) => console.log(message.sid));

    return res.status(200).json({
      message: `Phone number code have sent successfully. The code is active within ${process.env.PHONENO_CODE_EXPIRED_AFTER_MINUTES}`,
    });
  } catch (error) {
    return res.status(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const changeActiveStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const userId = req.params.id;

    await User.findByIdAndUpdate(userId, {
      isActive,
    });
    return res.status(HttpStatusCode.NO_CONTENT).json({
      message: "Change user activation successfully",
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

export default {
  register,
  login,
  getMyUserInfo,
  updateMyUserInfo,
  updateAvatar,
  getUserListByPage,
  getUserInActiveListByPage,
  sendRegistionCode,
  getAccessToken,
  getHomePageUser,
  countUser,
  getUserByName,
  getUserByID,
  setActive,
  getPhoneNumberCode,
  changeActiveStatus,
  validatePhoneNumber
};
