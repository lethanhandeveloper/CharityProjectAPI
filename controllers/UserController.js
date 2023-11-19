import HttpStatusCode from "../utils/HttpStatusCode.js";
import Exception from "../utils/Exception.js";
import { Commune, District, Province, User } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const isUserExists = async ({ email, phoneNumber }) => {
  const existingUser = await User.exists({
    $or: [{ email: email }, { phoneNumber: phoneNumber }],
  });

  return existingUser;
};

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
            specificAddress,
            image_url
    
        } = req.body


        if(await isUserExists({email, phoneNumber})) {
            res.status(HttpStatusCode.CONFLICT).json({
                message: "Email or phone number is exists already"
            })

      return;
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 1,
            phoneNumber,
            gender,
            age,
            communeId,
            specificAddress,
            image_url
        })

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
          expiresIn: "50m",
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
    console.log(error);
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
    const { name, email, phoneNumber, gender, age, commune } = req.body;

    if (await isUserExists({ email, phoneNumber })) {
      res.status(HttpStatusCode.CONFLICT).json({
        message: "Email or phone number existed in the system",
      });

      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      const userId = decoded.data._doc._id;

      try {
        await User.findByIdAndUpdate(
          userId,
          {
            name,
            email,
            phoneNumber,
            gender,
            age,
            commune,
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

export default {
  register,
  login,
  getMyUserInfo,
  updateMyUserInfo,
};
