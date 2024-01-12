import HttpStatusCode from "../utils/HttpStatusCode.js";
import { File } from "../models/index.js";
import Message from "../utils/Message.js";

const addFile = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const id = await File.create({
      fileUrl,
    });
    res.status(HttpStatusCode.OK).json({
      message: Message.success,
      result: id,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error,
    });
  }
};
const getFile = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await File.findById(id);
    res.status(HttpStatusCode.OK).json({
      message: "Server is error",
      result: response,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};
export default {
  addFile,
  getFile,
};
