import HttpStatusCode from "../utils/HttpStatusCode.js";
import Exception from "../utils/Exception.js";
import mongoose from "mongoose";
import { User, VerificationRequest } from "../models/index.js";
import jwt from "jsonwebtoken";
import {
  PersonalGeneralInfo,
  OrganizationGeneralInfo,
  CommitInfoVerification,
} from "../models/index.js";

const isRequestExistsbyUserId = async (userId) => {
  const personalGeneralInfo = await PersonalGeneralInfo.find({ userId });
  const organizationGeneralInfo =  await OrganizationGeneralInfo.find({ userId });

  if(personalGeneralInfo.length > 0) {
    console.log(personalGeneralInfo)
    personalGeneralInfo.forEach(async pgi => {
      const isNotApproved = await VerificationRequest.find({ _id: pgi.personalGeneralInfoId, status: 1 })
      if(isNotApproved){
        console.log("ok")
        return true;
      }
    });
  }

  if(organizationGeneralInfo > 0) {
    personalGeneralInfo.forEach(async ogi => {
      const isNotApproved = await VerificationRequest.find({ _id: ogi.personalGeneralInfoId, status: 1 })
      if(isNotApproved){
        return true;
      }
    });
  }
  
  return false;
}

const addNewVerificationRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const type = parseInt(req.params.type);
    if (isNaN(type) || (type != 1 && type != 2)) {
      throw new Exception("NotANumber");
    }

    const token = req.headers?.authorization?.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      const user = await User.findById(decoded.data._doc._id).exec();
     
      if(await isRequestExistsbyUserId(user._id)){
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "You have a request which is waiting for approval"
        })
      }
      let createdPGI = null;
      let createdOGI = null;
      const { goalName, targetAmount, startDate, endDate } =
        req.body.commitInfoVerification;

      if (type === 1) {
        const {
          personalGeneralInfo: {
            name,
            dateOfBirth,
            phoneNumber,
            representativeEmail,
            socialNetworkLink,
            address,
            roleOnClub,
            clubName,
            logo,
            underOrg,
            actionDescSocialLink,
            achivementDoc,
          },
        } = req.body;
        createdPGI = await PersonalGeneralInfo.create({
          name,
          dateOfBirth,
          phoneNumber,
          representativeEmail,
          socialNetworkLink,
          address,
          roleOnClub,
          clubName,
          logo,
          underOrg,
          actionDescSocialLink,
          achivementDoc,
          userId: user._id,
        });
      } else if (type === 2) {
        const {
          organizationGeneralInfo: {
            name,
            establishedDate,
            website,
            operationField,
            address,
            actionDescSocialLink,
            achivementDoc,
            representativeName,
            representativePhoneNumber,
            representativeEmail,
          },
        } = req.body;

        createdOGI = await OrganizationGeneralInfo.create({
          name,
          establishedDate,
          website,
          operationField,
          address,
          userId: user._id,
          actionDescSocialLink,
          achivementDoc,
          representativeName,
          representativePhoneNumber,
          representativeEmail,
        });
      }

      const createdCIV = await CommitInfoVerification.create({
        goalName,
        targetAmount,
        startDate,
        endDate,
      });

      await VerificationRequest.create({
        type,
        personalGeneralInfoId: createdPGI?._id,
        organizationGeneralInfoId: createdOGI?._id,
        commitInfoVerificationId: createdCIV._id,

        requestedUserId: user._id,
      });

      res.status(HttpStatusCode.CREATED).json({
        message: "Create Verification Request Successfully",
      });
    });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    if (error.message === "UserNotExists") {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "User name is not exists",
      });

      return;
    }

    if (error.message === "NotANumber") {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Your data is not valid",
      });

      return;
    }

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  } finally {
    session.endSession();
  }
};

const getAllVerificationRequest = async (req, res) => {
  try {
    const requests = await VerificationRequest.find();
    let personalGeneralInfo;
    let organizationGeneralInfo;

    const returnRequest = await Promise.all(
      requests.map(async (request) => {
        let commitInfoVerification = await CommitInfoVerification.findById(
          request.commitInfoVerificationId
        );

        if (request.type === 1) {
          personalGeneralInfo = await PersonalGeneralInfo.findById(
            request.personalGeneralInfoId
          ).populate("userId");

          return {
            id: request._id,
            type: request.type,
            status: request.status,
            personalGeneralInfo,
            commitInfoVerification,
          };
        } else {
          organizationGeneralInfo = await OrganizationGeneralInfo.findById(
            request.organizationGeneralInfoId
          ).populate("userId");

          return {
            id: request._id,
            type: request.type,
            status: request.status,
            organizationGeneralInfo,
            commitInfoVerification,
          };
        }
      })
    );

    res.status(HttpStatusCode.OK).json({
      message: "Get all verification request successfully",
      result: returnRequest,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reqId = req.params.id;
    let verificationRequest = await VerificationRequest.findById(reqId);
    verificationRequest.status = status;
    verificationRequest.save();
    let user;

    if (status === 2) {
      if (verificationRequest.type === 1) {
        user = await PersonalGeneralInfo.findById(
          verificationRequest.personalGeneralInfoId
        );
        await User.findByIdAndUpdate(user.userId, { role: 2 });
      } else if (verificationRequest.type === 2) {
        user = await OrganizationGeneralInfo.findById(
          verificationRequest.personalGeneralInfoId
        );
        await User.findByIdAndUpdate(user.userId, { role: 3 });
      }
    }

    res.status(HttpStatusCode.NO_CONTENT).json({
      message: "Update request status successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const getVerificationRequestByPagination = async (req, res) => {
  try {
    const { search_text, page, no_item_per_page } = req.body;
    const skip = (page - 1) * no_item_per_page;

    const personalInfo = await PersonalGeneralInfo.find({
      name: { $regex: new RegExp(search_text, "i") },
    });
    const organizationInfo = await OrganizationGeneralInfo.find({
      name: { $regex: new RegExp(search_text, "i") },
    });

    let personalGeneralInfoIdArr = [];
    let organizationGeneralInfoIdArr = [];

    personalInfo.forEach((pi) => {
      personalGeneralInfoIdArr.push(pi._id);
    });

    organizationInfo.forEach((oi) => {
      organizationGeneralInfoIdArr.push(oi._id);
    });

    const requests = await VerificationRequest.find({
      $or: [
        { personalGeneralInfoId: { $in: personalGeneralInfoIdArr } },
        { organizationGeneralInfoId: { $in: organizationGeneralInfoIdArr } },
      ],
    })
      .skip(skip)
      .limit(no_item_per_page)
      .exec();

    let personalGeneralInfo;
    let organizationGeneralInfo;

    const returnRequest = await Promise.all(
      requests.map(async (request) => {
        let commitInfoVerification = await CommitInfoVerification.findById(
          request.commitInfoVerificationId
        );

        if (request.type === 1) {
          personalGeneralInfo = await PersonalGeneralInfo.findById(
            request.personalGeneralInfoId
          ).populate("userId");

          return {
            id: request._id,
            type: request.type,
            status: request.status,
            personalGeneralInfo,
            commitInfoVerification,
          };
        } else {
          organizationGeneralInfo = await OrganizationGeneralInfo.findById(
            request.organizationGeneralInfoId
          ).populate("userId");

          return {
            id: request._id,
            type: request.type,
            status: request.status,
            organizationGeneralInfo,
            commitInfoVerification,
          };
        }
      })
    );

    res.status(HttpStatusCode.OK).json({
      message: "Get all verification request successfully",
      result: returnRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const getRequestByCurrentUser = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET);

    const requests = await VerificationRequest.find({
      requestedUserId: user.data._doc._id,
    });
    let personalGeneralInfo;
    let organizationGeneralInfo;

    const returnRequest = await Promise.all(
      requests.map(async (request) => {
        let commitInfoVerification = await CommitInfoVerification.findById(
          request.commitInfoVerificationId
        );

        if (request.type === 1) {
          personalGeneralInfo = await PersonalGeneralInfo.findById(
            request.personalGeneralInfoId
          )
            .find({})
            .populate("userId");

          return {
            id: request._id,
            type: request.type,
            status: request.status,
            personalGeneralInfo,
            commitInfoVerification,
          };
        } else {
          organizationGeneralInfo = await OrganizationGeneralInfo.findById(
            request.organizationGeneralInfoId
          ).populate("userId");

          return {
            id: request._id,
            type: request.type,
            status: request.status,
            organizationGeneralInfo,
            commitInfoVerification,
          };
        }
      })
    );

    res.status(HttpStatusCode.OK).json({
      message: "Get all verification request successfully",
      result: returnRequest,
    });
  } catch (error) {
    console.log(error);
  }
};

const getRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await VerificationRequest.findById(requestId);
    let personalGeneralInfo;
    let organizationGeneralInfo;
    let returnRequest;

    let commitInfoVerification = await CommitInfoVerification.findById(
      request.commitInfoVerificationId
    );

    if (request.type === 1) {
      personalGeneralInfo = await PersonalGeneralInfo.findById(
        request.personalGeneralInfoId
      );

      returnRequest = {
        id: request._id,
        type: request.type,
        status: request.status,
        personalGeneralInfo,
        commitInfoVerification,
      };
    } else {
      organizationGeneralInfo = await OrganizationGeneralInfo.findById(
        request.organizationGeneralInfoId
      );

      returnRequest = {
        id: request._id,
        type: request.type,
        status: request.status,
        organizationGeneralInfo,
        commitInfoVerification,
      };
    }

    res.status(HttpStatusCode.OK).json({
      message: "Get verification request successfully",
      result: returnRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};
const getRequestByUserId = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await VerificationRequest.findOne({
      requestedUserId: requestId,
    });
    let personalGeneralInfo;
    let organizationGeneralInfo;
    let returnRequest;

    let commitInfoVerification = await CommitInfoVerification.findById(
      request.commitInfoVerificationId
    );

    if (request.type === 1) {
      personalGeneralInfo = await PersonalGeneralInfo.findById(
        request.personalGeneralInfoId
      );

      returnRequest = {
        id: request._id,
        type: request.type,
        status: request.status,
        personalGeneralInfo,
        commitInfoVerification,
      };
    } else {
      organizationGeneralInfo = await OrganizationGeneralInfo.findById(
        request.organizationGeneralInfoId
      );

      returnRequest = {
        id: request._id,
        type: request.type,
        status: request.status,
        organizationGeneralInfo,
        commitInfoVerification,
      };
    }

    res.status(HttpStatusCode.OK).json({
      message: "Get verification request successfully",
      result: returnRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const updateMyRequestById = async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const user = await jwt.verify(token, process.env.JWT_SECRET);

  const requestId = req.params.id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const request = await VerificationRequest.findById(requestId);
    if (!request) {
      throw new Exception("Notfound");
    }

    if (request.requestedUserId != user.data._doc._id) {
      throw new Exception("Unauthorized");
    }

    console.log(request.personalGeneralInfoId);

    if (request.type === 1) {
      const {
        name,
        dateOfBirth,
        phoneNumber,
        email,
        socialNetworkLink,
        address,
        roleOnClub,
        clubName,
        logo,
        underOrg,
        actionDescSociaLink,
        achivementDoc,
      } = req.body.personalGeneralInfo;

      await PersonalGeneralInfo.findOneAndUpdate(
        { _id: request.personalGeneralInfoId },
        {
          name,
          dateOfBirth,
          phoneNumber,
          email,
          socialNetworkLink,
          address,
          roleOnClub,
          clubName,
          logo,
          underOrg,
          actionDescSociaLink,
          achivementDoc,
        }
      );
    } else {
      const {
        organizationGeneralInfo: {
          name,
          establishedDate,
          website,
          operationField,
          address,
          actionDescSocialLink,
          achivementDoc,
          representativeName,
          representativePhoneNumber,
          representativeEmail,
        },
      } = req.body;

      await OrganizationGeneralInfo.findOneAndUpdate(
        { _id: request.organizationGeneralInfoId },
        {
          name,
          establishedDate,
          website,
          operationField,
          address,
          actionDescSocialLink,
          achivementDoc,
          representativeName,
          representativePhoneNumber,
          representativeEmail,
        }
      );
    }

    const { goalName, targetAmount, startDate, endDate } =
      req.body.commitInfoVerification;

    await CommitInfoVerification.findByIdAndUpdate(
      request.commitInfoVerificationId,
      {
        goalName,
        targetAmount,
        startDate,
        endDate,
      }
    );

    session.commitTransaction();

    return res.status(HttpStatusCode.NO_CONTENT).json({
      message: "Update verification request successfully",
    });
  } catch (error) {
    console.log(error);
    session.abortTransaction();
    if (error.message === "Unauthorized") {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "You don't have right to call this route",
      });
    }

    if (error.message === "Notfound") {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: "This verification request is not exists",
      });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const countVerificationRequestRecords = async (req, res) => {
  try {
    const search_text = req.query.search_text;
    const personalCount = await PersonalGeneralInfo.countDocuments({
      name: { $regex: new RegExp(search_text, "i") },
    });
    const organizationCount = await OrganizationGeneralInfo.countDocuments({
      name: { $regex: new RegExp(search_text, "i") },
    });

    return res.status(HttpStatusCode.OK).json({
      message: "Get verification request number successfully",
      result: personalCount + organizationCount,
    });
  } catch (error) {
    //console.log(error)
    return res.json(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.INTERNAL_SERVER_ERROR,
    });
  }
};

export default {
  addNewVerificationRequest,
  getAllVerificationRequest,
  getVerificationRequestByPagination,
  updateRequestStatus,
  getRequestByCurrentUser,
  getRequestById,
  updateMyRequestById,
  countVerificationRequestRecords,
  getRequestByUserId,
};
