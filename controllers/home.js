import HttpStatusCode from "../utils/HttpStatusCode.js";
import Message from "../utils/Message.js";
import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import Origanization from "../models/OrganizationGeneralInfo.js";
import Personal from "../models/PersonalGeneralInfo.js";

const getCountForHome = async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    const campaignCount = await Campaign.countDocuments();
    const organizationCount = await Origanization.countDocuments();
    res.status(HttpStatusCode.OK).json({
      message: Message.success,
      result: {
        userCount,
        campaignCount,
        organizationCount,
      },
    });
  } catch (err) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Message.error,
    });
  }
};

const getCountForAdmin = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const campaignCount = await Campaign.countDocuments();
    const campaignFinishCount = await Campaign.countDocuments();
    const organizationCount = await Origanization.countDocuments();
    const personalCount = await Personal.countDocuments();
    const campaignInMonth = await Campaign.countDocuments();
    const userInMonth = await User.countDocuments();
    res.status(HttpStatusCode.OK).json({
      message: Message.success,
      result: {
        userCount,
        campaignCount,
        organizationCount,
        campaignFinishCount,
        personalCount,
        campaignInMonth,
        userInMonth,
      },
    });
  } catch (err) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Message.error,
    });
  }
};
export default {
  getCountForAdmin,
  getCountForHome,
};
