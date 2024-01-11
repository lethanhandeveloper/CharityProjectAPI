import { Campaign } from "../models/index.js";
import { sendEmailByType } from "../services/EmailCustom.js";
import HttpStatusCode from "../utils/HttpStatusCode.js";
import Message from "../utils/Message.js";

const sendEmail = async (req, res) => {
  try {
    const { type, campaignId, emailList, reason } = req.body;
    const campaignData = await Campaign.findById(campaignId).exec();

    let data;
    if (type === "Cancel") {
      data = {
        userName: "2",
        campaignName: campaignData.title,
        reason,
        endDate: campaignData.endDate.toString(),
        toEmail: emailList,
      };
    } else if (type === "Reject") {
      data = {
        userName: "2",
        campaignName: campaignData.title,
        reason,
        fileUrl: "2",
        endDate: campaignData.endDate.toString(),
        toEmail: emailList,
      };
    } else {
      data = {
        userName: "2",
        campaignName: campaignData.title,
        reason,
        fileUrl: "file",
        endDate: campaignData.endDate,
        toEmail: emailList,
      };
    }
    sendEmailByType({ ...data, toEmail: emailList }, type);
    res.status(HttpStatusCode.OK).json({
      message: Message.success,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Message.error,
    });
  }
};
export default { sendEmail };
