import HttpStatusCode from "../utils/HttpStatusCode.js";
import Message from "../utils/Message.js";
import Banner from "../models/Banner.js";
const getAllList = async (req, res) => {
  try {
    const data = await Banner.find().exec();
    res.status(HttpStatusCode.OK).json({
      message: Message.success,
      data: data,
    });
    res.status(HttpStatusCode.OK).json({
      result: data,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Message.error,
    });
  }
};
const getListActive = async (req, res) => {
  try {
    const data = await Banner.find({ isActive: true }).exec();
    res.status(HttpStatusCode.OK).json({
      result: data,
      message: Message.success,
    });
  } catch (error) {}
};
const addNewBanner = async (req, res) => {
  try {
    const { url, title, description } = req.body;
    await Banner.create({ url, title, description, isActive: true });
    res.status(HttpStatusCode.OK).json({
      message: Message.success,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Message.error,
    });
  }
};
const updateBaner = async (req, res) => {
  try {
    const { id, url, title, description, isActive } = req.body;
    await Banner.findByIdAndUpdate(id, {
      title,
      url,
      description,
      isActive,
    });
    res.status(HttpStatusCode.OK).json({
      message: Message.success,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: Message.error });
  }
};
const deleteBanner = async (req, res) => {
  try {
    const { id, isActive } = req.body;
    await Banner.findByIdAndUpdate(id, { isActive });
    res.status(HttpStatusCode.OK).json({
      message: Message.success,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: Message.error });
  }
};
export default {
  getAllList,
  addNewBanner,
  updateBaner,
  deleteBanner,
  getListActive,
};
