import { Campaign } from "../models/index.js";
import { sendEmailByType } from "../services/EmailCustom.js";

const sendEmail = async (req, res) => {
  try {
    const { type, campaignID, emailList } = req.body;
    const campaignData = await Campaign.findById(campaignID).exec();
    let data;
    if (type === "cancel") {
      data = {
        userName,
        campaignName: campaignData.title,
        reason,
        toEmail: emailList,
      };
    } else if (type === "reject") {
      data = {
        userName,
        campaignName: campaignData.title,
        reason,
        fileUrl,
        endDate: campaignData.endDate,
        toEmail: emailList,
      };
    } else {
      data = {
        userName,
        campaignName: campaignData.title,
        reason,
        fileUrl,
        endDate: campaignData.endDate,
        toEmail: emailList,
      };
    }
    sendEmailByType({ ...data, toEmail: emailList }, type);
    res.status(HttpStatusCode.OK).json({
      message: Message.success,
      result: data,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Message.error,
    });
  }
};
export default { sendEmail };
