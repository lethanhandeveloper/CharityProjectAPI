import HttpStatusCode from "../utils/HttpStatusCode.js";
import Message from "../utils/Message.js";

const getAllList = async (req, res) => {
  try {
    const data = [
      {
        id: "",
        url: "",
        title: "",
        description: "",
      },
    ];
    res.status(HttpStatusCode.OK).json({
      message: Message.success,
      data: data,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Message.error,
    });
  }
};
const addNewBanner = async (req, res) => {
  try {
    //create banner
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Message.error,
    });
  }
};
const updateBaner = async (req, res) => {
  try {
    //update banner
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: Message.error });
  }
};
const deleteBanner = async (req, res) => {
  try {
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
};
