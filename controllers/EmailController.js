import { sendRegistionCodeEmail } from "../services/EmailCustom.js";

const sendEmail = async (req, res) => {
  try {
    const { type, id, emailList } = req.body;
    sendRegistionCodeEmail();
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
