import HttpStatusCode from "../utils/HttpStatusCode.js";
import Exception from "../utils/Exception.js";
import { Campaign, User } from "../models/index.js";
import { PersonalGeneralInfo, OrganizationGeneralInfo, CommitInfoVerification, SurveyInfoVerification } from "../models/index.js";

const addNewVerificationRequest = async (req, res) => {
  try {
    const type = req.params.type

    if(isNaN(type) || (type !== 1 || type !== 2)){
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

    const createdPGI = null
    const createdOGI = null

    if(type === 1) {
      createdPGI = await PersonalGeneralInfo.create({
        type,
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

    
  } catch (error) {
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
};


export default {
  addNewVerificationRequest
};
