import Exception from "../utils/Exception.js";
import HttpStatusCode from "../utils/HttpStatusCode.js";
import Feedback from "../models/Feedback.js";

const addNewFeedback = async (req, res) => {
  const { userId, userTitle, content } = req.body;

  try {
    await Feedback.create({
      userId,
      userTitle,
      content,
      isShowInHomePage: false,
    });
    res.status(HttpStatusCode.OK).json({
      message: "Add a new feedback successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        messsage: "Feedback information is not valid. Please check again",
      });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      messsage: Exception.SERVER_ERROR,
    });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("userId").exec();
    res.status(HttpStatusCode.OK).json({
      message: "Get all feedbacks successfully",
      result: feedbacks,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const updateFeedbackById = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const { userId, userTitle, content } = req.body;

    await Feedback.findByIdAndUpdate(feedbackId, {
      userId,
      userTitle,
      content,
    });

    res.status(HttpStatusCode.OK).json({
      message: "Update feedback successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        messsage: "Feedback information is not valid. Please check again",
      });
    }

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const deleteFeedbackById = async (req, res) => {
  try {
    const feedbackId = req.params.id;

    await Feedback.findByIdAndDelete(feedbackId);

    return res.status(HttpStatusCode.OK).json({
      message: "Delete feedback successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const setShowInHomepage = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const { isShowInHomePage } = req.body;

    const count = await Feedback.findByIdAndUpdate(feedbackId, {
      isShowInHomePage,
    });

    return res.status(HttpStatusCode.NO_CONTENT).json({
      message: "Update isShowInHomePage successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        messsage: "Feedback information is not valid. Please check again",
      });
    }

    return res.json(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.INTERNAL_SERVER_ERROR,
    });
  }
};

const getForHomepage = async (req, res) => {
  try {
    const quantity = req.query.quantity;

    const feedbacks = await Feedback.find({ isShowInHomePage: true }).limit(
      quantity
    );

    return res.status(HttpStatusCode.OK).json({
      message: "Get feedbacks successfully",
      result: feedbacks,
    });
  } catch (error) {
    return res.json(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.INTERNAL_SERVER_ERROR,
    });
  }
};

const getFeedbackByPagination = async (req, res) => {
  try {
    const { search_text, page, no_item_per_page } = req.body;

    const skip = (page - 1) * no_item_per_page;

    const feedbacks = await Feedback.find({
      content: { $regex: new RegExp(search_text, "i") },
    })
      .skip(skip)
      .limit(no_item_per_page)
      .exec();
    const count = await Feedback.countDocuments({
      content: { $regex: new RegExp(search_text, "i") },
    });
    return res.status(HttpStatusCode.OK).json({
      message: "Get Feedback successfully",
      result: feedbacks,
      totalItems: count,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

export default {
  addNewFeedback,
  getAllFeedback,
  updateFeedbackById,
  deleteFeedbackById,
  setShowInHomepage,
  getForHomepage,
  getFeedbackByPagination,
};
