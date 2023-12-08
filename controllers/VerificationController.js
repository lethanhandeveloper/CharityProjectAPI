import HttpStatusCode from "../utils/HttpStatusCode.js";
import Exception from "../utils/Exception.js";
import mongoose from "mongoose";
import { User, VerificationRequest } from "../models/index.js";
import {
  PersonalGeneralInfo,
  OrganizationGeneralInfo,
  CommitInfoVerification,
  SurveyInfoVerification,
} from "../models/index.js";

const addNewVerificationRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const type = parseInt(req.params.type);
    if (isNaN(type) || (type != 1 && type != 2)) {
      throw new Exception("NotANumber");
    }

    let createdPGI = null;
    let createdOGI = null;
    const {
      optionCommitOne,
      optionCommitTwo,
      optionCommitThree,
      optionCommitFour,
      optionCommitFive,
      publicBankAccount,
      goalName,
      targetAmount,
      startDate,
      endDate,
    } = req.body.commitInfoVerification;

    const {
      optionSurveyOne,
      optionSurveyTwo,
      optionSurveyThree,
      optionSurveyFour,
      optionSurveyFive,
      lawOneOption,
      lawTwoOption,
      lawThreeOption,
      lawFourOption,
      lawFiveOption,
      chanel,
    } = req.body.surveyInfoVerification;

    if (type === 1) {
      const {
        personalGeneralInfo: {
          personalName,
          dateOfBirth,
          phoneNumber,
          email,
          socialNetworkLink,
          personalAddress,
          roleOnClub,
          clubName,
          logo,
          underOrg,
          actionDescSociaLink,
          personalAchivementDoc,
          personalUserName,
        },
      } = req.body;

      const user = await User.findOne({
        userName: personalUserName.toString(),
      });

      if (!user) {
        throw new Exception("UserNotExists");
      }

      createdPGI = await PersonalGeneralInfo.create({
        name: personalName,
        dateOfBirth,
        phoneNumber,
        email,
        socialNetworkLink,
        address: personalAddress,
        roleOnClub,
        clubName,
        logo,
        underOrg,
        actionDescSociaLink,
        achivementDoc: personalAchivementDoc,
        userId: user._id,
      });
    } else if (type === 2) {
      const {
        organizationGeneralInfo: {
          organizationName,
          establishedDate,
          website,
          operationField,
          address,
          organizationUserName,
          actionDescSocialLink,
          achivementDoc,
          representativeName,
          representativePhoneNumber,
          representativeEmail,
        },
      } = req.body;

      const user = await User.findOne({
        userName: organizationUserName.toString(),
      });

      if (!user) {
        throw new Exception("UserNotExists");
      }

      createdOGI = await OrganizationGeneralInfo.create({
        name: organizationName,
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
      optionCommitOne,
      optionCommitTwo,
      optionCommitThree,
      optionCommitFour,
      optionCommitFive,
      publicBankAccount,
      goalName,
      targetAmount,
      startDate,
      endDate,
    });

    const createdSIV = await SurveyInfoVerification.create({
      optionSurveyOne,
      optionSurveyTwo,
      optionSurveyThree,
      optionSurveyFour,
      optionSurveyFive,
      lawOneOption,
      lawTwoOption,
      lawThreeOption,
      lawFourOption,
      lawFiveOption,
      chanel,
    });

    await VerificationRequest.create({
      type,
      personalGeneralInfoId: createdPGI?._id,
      organizationGeneralInfoId: createdOGI?._id,
      commitInfoVerificationId: createdCIV._id,
      surveyInfoVerificationId: createdSIV._id,
    });

    await session.commitTransaction();

    res.status(HttpStatusCode.CREATED).json({
      message: "Create Verification Request Successfully",
    });
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
        let surveyInfoVerification = await SurveyInfoVerification.findById(
          request.surveyInfoVerificationId
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
            surveyInfoVerification,
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
            surveyInfoVerification,
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
    const { page, no_item_per_page } = req.body;
    const skip = (page - 1) * no_item_per_page;

    const requests = await VerificationRequest.find()
      .skip(skip)
      .limit(no_item_per_page)
      .exec();

    let personalGeneralInfo;
    let organizationGeneralInfo;
    let returnRequestArr = [];
    const returnRequest = await Promise.all(
      requests.map(async (request) => {
        let commitInfoVerification = await CommitInfoVerification.findById(
          request.commitInfoVerificationId
        );
        let surveyInfoVerification = await SurveyInfoVerification.findById(
          request.surveyInfoVerificationId
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
            surveyInfoVerification,
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
            surveyInfoVerification,
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

export default {
  addNewVerificationRequest,
  getAllVerificationRequest,
  getVerificationRequestByPagination,
  updateRequestStatus,
};
