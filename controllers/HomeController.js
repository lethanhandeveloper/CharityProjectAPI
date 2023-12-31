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
    var newDate = new Date();
    var targetMonth = newDate.getMonth() - 1;
    var overflowYears = Math.floor(targetMonth / 12);
    var newYear = newDate.getFullYear() + overflowYears;
    var newMonth = targetMonth % 12;
    if (newMonth < 0) {
      newYear--;
      newMonth += 12;
    }
    newDate.setFullYear(newYear);
    newDate.setMonth(newMonth);

    const userActiveCount = await User.countDocuments();
    const userDeactiveCount = await User.countDocuments();
    const campaignCount = await Campaign.countDocuments();
    const campaignFinishCount = await Campaign.countDocuments();
    const organizationCount = await Origanization.countDocuments();
    const personalCount = await Personal.countDocuments();
    const campaignInMonth = await Campaign.find({
      createdDate: { $gte: newDate },
    }).countDocuments();
    const userInMonth = await User.find({
      createdDate: { $gte: newDate },
    }).countDocuments();

    res.status(HttpStatusCode.OK).json({
      message: Message.success,
      result: {
        userActiveCount,
        userDeactiveCount,
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
