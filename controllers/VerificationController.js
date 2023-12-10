import HttpStatusCode from "../utils/HttpStatusCode.js";
import Exception from "../utils/Exception.js";
import mongoose from "mongoose";
import { User, VerificationRequest } from "../models/index.js";
import jwt from "jsonwebtoken";
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

    let user;

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

      user = await User.findOne({
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

      user = await User.findOne({
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
      requestedUserId: user._id
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
    const { search_text, page, no_item_per_page } = req.body;
    const skip = (page - 1) * no_item_per_page;

    const personalInfo = await PersonalGeneralInfo.find({ name : { $regex: new RegExp(search_text, 'i')} })
    const organizationInfo = await OrganizationGeneralInfo.find({name : { $regex: new RegExp(search_text, 'i')}})
    
    let personalGeneralInfoIdArr = [];
    let organizationGeneralInfoIdArr = [];

    personalInfo.forEach(pi => {
      personalGeneralInfoIdArr.push(pi._id)
    })

    organizationInfo.forEach(oi => {
      organizationGeneralInfoIdArr.push(oi._id)
    })
    
    const requests = await VerificationRequest.find({
      $or: [
        { personalGeneralInfoId: { $in: personalGeneralInfoIdArr } },
        { organizationGeneralInfoId: { $in: organizationGeneralInfoIdArr } }
      ]
    })
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
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const getRequestByCurrentUser = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1]
    const user = await jwt.verify(token, process.env.JWT_SECRET)

    const requests = await VerificationRequest.find({ requestedUserId: user.data._doc._id });
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
        console.log(request);
        let generalInfo;

        if (request.type === 1) {
          personalGeneralInfo = await PersonalGeneralInfo.findById(
            request.personalGeneralInfoId
          ).find({  }).populate("userId");

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
    console.log(error)
  }
}

const getRequestById = async (req, res) => {
  try {
    const requestId =  req.params.id
    const request = await VerificationRequest.findById(requestId);
    let personalGeneralInfo;
    let organizationGeneralInfo;
    let returnRequest;

    let commitInfoVerification = await CommitInfoVerification.findById(
      request.commitInfoVerificationId
    );
    let surveyInfoVerification = await SurveyInfoVerification.findById(
      request.surveyInfoVerificationId
    );

    if (request.type === 1) {
      personalGeneralInfo = await PersonalGeneralInfo.findById(
        request.personalGeneralInfoId
      )

      returnRequest = {
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
      )

      returnRequest = {
        id: request._id,
        type: request.type,
        status: request.status,
        organizationGeneralInfo,
        commitInfoVerification,
        surveyInfoVerification,
      };
    }

    res.status(HttpStatusCode.OK).json({
      message: "Get verification request successfully",
      result: returnRequest
    });
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR
    })
  }
}

const updateMyRequestById = async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1]
  const user = await jwt.verify(token, process.env.JWT_SECRET)

  const requestId = req.params.id
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const request = await VerificationRequest.findById(requestId)
    if(!request){
      throw new Exception("Notfound");
    }

    if(request.requestedUserId != user.data._doc._id){
      throw new Exception("Unauthorized");
    }

    console.log(request.personalGeneralInfoId)
    
    if(request.type === 1){
      const { 
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
        personalAchivementDoc
       } = req.body.personalGeneralInfo
  
      await PersonalGeneralInfo.findOneAndUpdate({_id : request.personalGeneralInfoId}, {
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
        achivementDoc: personalAchivementDoc
      })
    }else{
      const {
        organizationGeneralInfo: {
          organizationName,
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

      await OrganizationGeneralInfo.findOneAndUpdate({ _id : request.organizationGeneralInfoId } , {
        name: organizationName,
        establishedDate,
        website,
        operationField,
        address,
        actionDescSocialLink,
        achivementDoc,
        representativeName,
        representativePhoneNumber,
        representativeEmail,
      })
    }

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

    await CommitInfoVerification.findByIdAndUpdate(request.commitInfoVerificationId, {
      optionCommitOne : optionCommitOne,
      optionCommitTwo,
      optionCommitThree,
      optionCommitFour,
      optionCommitFive,
      publicBankAccount,
      goalName,
      targetAmount,
      startDate,
      endDate,
    })
    
    console.log(request.surveyInfoVerificationId)
    await SurveyInfoVerification.findByIdAndUpdate(request.surveyInfoVerificationId, {
      optionSurveyOne: false,
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
    })

    session.commitTransaction()

    return res.status(HttpStatusCode.NO_CONTENT).json({
      message: "Update verification request successfully"
    })
  } catch (error) {
    console.log(error)
    session.abortTransaction()
    if(error.message === 'Unauthorized'){
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "You don't have right to call this route"
      })
    }

    if(error.message === 'Notfound'){
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: "This verification request is not exists"
      })
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR
    })
  }
}

const countVerificationRequestRecords = async (req, res) => {
  try {
    const search_text = req.query.search_text
    const personalCount = await PersonalGeneralInfo.countDocuments({ name : { $regex: new RegExp(search_text, 'i') } })
    const organizationCount = await OrganizationGeneralInfo.countDocuments({ name : { $regex: new RegExp(search_text, 'i') } })

    return res.status(HttpStatusCode.OK).json({
      message: "Get verification request number successfully",
      result: personalCount + organizationCount
    })
  } catch (error) {
    //console.log(error)
    return res.json(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.INTERNAL_SERVER_ERROR
    })
  }
}



export default {
  addNewVerificationRequest,
  getAllVerificationRequest,
  getVerificationRequestByPagination,
  updateRequestStatus,
  getRequestByCurrentUser,
  getRequestById,
  updateMyRequestById,
  countVerificationRequestRecords
};
