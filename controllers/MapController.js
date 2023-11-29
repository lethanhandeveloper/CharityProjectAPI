import HttpStatusCode from "../utils/HttpStatusCode.js";
import Map from "../models/Map.js";
import Message from "../utils/Message.js";
import Banner from "../models/Banner.js";
const getMapList = async (req, res) => {
  try {
    const data = await Map.find().exec();
    res.status(HttpStatusCode.OK).json({
      data: data,
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
    const { lat, long, idRecord, type } = req.body;
    await Map.create({
      lat,
      long,
      type,
      idRecord,
    });
    res.status(HttpStatusCode.OK).json({
      message: Message.success,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};
const updateMap = async (req, res) => {
  try {
    const { lat, long, idRecord, id, type } = req.body;
    await Banner.findByIdAndUpdate(id, {
      lat,
      long,
      type,
      idRecord,
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
