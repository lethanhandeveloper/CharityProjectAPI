import HttpStatusCode from "../utils/HttpStatusCode.js";
import { Map } from "../models/index.js";
import Message from "../utils/Message.js";

const getMapList = async (req, res) => {
  try {
    const data = await Map.find().populate("campaignId").exec();
    res.status(HttpStatusCode.OK).json({
      result: data,
      message: Message.success,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Message.error,
    });
  }
};

const addNewMap = async (req, res) => {
  try {
    const { lat, long, campaignId, type } = req.body;
    await Map.create({
      lat,
      long,
      type,
      campaignId,
    });
    res.status(HttpStatusCode.OK).json({
      message: Message.success,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error,
    });
  }
};
const updateMap = async (req, res) => {
  try {
    const { lat, long, campaign, id, type } = req.body;
    await Map.findByIdAndUpdate(id, {
      lat,
      long,
      type,
      campaign,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};
export default {
  getMapList,
  addNewMap,
  updateMap,
};
