import HttpStatusCode from "../utils/HttpStatusCode.js";
import Exception from "../utils/Exception.js";
import mongoose from "mongoose";
import { Campaign, User, VerificationRequest } from "../models/index.js";
import { PersonalGeneralInfo, OrganizationGeneralInfo, CommitInfoVerification, SurveyInfoVerification } from "../models/index.js";

const addNewVerificationRequest = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const type = parseInt(req.params.type)
    if(isNaN(type) || (type != 1 && type != 2)){
      throw new Exception("NotANumber");
      return 
    }

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
        organizationGeneralInfo
      },
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
      commitInfoVerification: {
        optionCommitOne,
        optionCommitTwo,
        optionCommitThree,
        optionCommitFour,
        optionCommitFive,
        publicBankAccount,
        goalName,
        targetAmount,
        startDate,
        endDate
      },
      surveyInfoVerification: {
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
        chanel
      }
    } = req.body

    let createdPGI = null
    let createdOGI = null

    session.startTransaction()

    if(type === 1) {
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
        userName: personalUserName,
      })

    }else if(type === 2){
      createdOGI = await OrganizationGeneralInfo.create({
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
      })
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
      endDate
    })

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
      chanel
    })
    

    await VerificationRequest.create({
      type,
      personalGeneralInfoId: createdPGI?._id,
      organizationGeneralInfoId: createdOGI?._id,
      commitInfoVerificationId: createdCIV._id,
      surveyInfoVerification: createdSIV._id
    })

    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction();
    if(error.message === 'NotANumber'){
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Your data is not valid"
      })

      return
    }

    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({
        message: Exception.SERVER_ERROR
      });
  }
  finally {
    session.endSession();
  }
  
};


export default {
  addNewVerificationRequest
};
