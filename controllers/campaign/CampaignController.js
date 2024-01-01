import { Campaign } from "../../models/index.js";
import Exception from "../../utils/Exception.js";
import HttpStatusCode from "../../utils/HttpStatusCode.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const addNewCampaign = async (req, res) => {
  try {
    const {
      categoryId,
      itemTypeId,
      provinceId,
      title,
      targetValue,
      endDate,
      description,
      thumbnail,
      fileUrl,
    } = req.body;
    const token = req.headers?.authorization?.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      const userId = decoded.data._doc._id;

      await Campaign.create({
        creatorId: userId,
        categoryId: new mongoose.Types.ObjectId(categoryId),
        itemTypeId: new mongoose.Types.ObjectId(itemTypeId),
        provinceId: new mongoose.Types.ObjectId(provinceId),
        title,
        targetValue,
        endDate,
        createdDate: Date.now(),
        description,
        thumbnail,
        fileUrl,
        status: "DRAFT",
      });

      res.status(HttpStatusCode.CREATED).json({
        message: "Create Campaign successfully",
      });
    });
  } catch (error) {
    if (error.name === Exception.VALIDATION_ERROR) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Your data is not valid",
      });

      return;
    }

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const getAllCampaign = async (req, res) => {
  try {
    const campaigns = await Campaign.find().exec();

    res.status(HttpStatusCode.OK).json({
      message: "Get All Campaigns successfully",
      result: campaigns,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};
const getCampaignByCurrentUser = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      const userId = decoded.data._doc._id;

      const campaigns = await Campaign.find({ creatorId: userId }).exec();
      res.status(HttpStatusCode.OK).json({
        message: "Get All Campaigns successfully",
        result: campaigns,
      });
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const getCampaignByUser = async (req, res) => {
  try {
    const { id } = req.body;
    const campaigns = await Campaign.find({ creatorId: id }).exec();
    res.status(HttpStatusCode.OK).json({
      message: "Get All Campaigns successfully",
      result: campaigns,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const getCampaignDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const campaign = await Campaign.findById(id).exec();

    res.status(HttpStatusCode.OK).json({
      message: "Get All Campaign successfully",
      result: campaign,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const getCampaignByFilter = async (req, res) => {
  try {
    const {
      page,
      no_item_per_page,
      search_text,
      provinceId,
      categoryId,
      status,
    } = req.body;

    // const query = {
    //   $and: [
    //     { provinceId: provinceId },
    //     { categoryId: categoryId },
    //     { itemTypeId: itemTypeId },
    //     { creatorId: creatorId },
    //     { $or: [{ title: search_text }] },
    //   ],
    // };

    const query = [];
    if (provinceId) {
      query.push({ provinceId: provinceId });
    }
    if (categoryId) {
      query.push({ categoryId: categoryId });
    }
    if (status) {
      query.push({ status: status });
    }
    if (search_text) {
      query.push({ title: { $regex: new RegExp(search_text, "i") } });
    }

    let queryMongo = {};
    if (query.length > 0) {
      queryMongo = {
        $and: [...query],
      };
    }
    const skip = (page - 1) * no_item_per_page;

    const campaigns = await Campaign.find(queryMongo)
      .skip(skip)
      .limit(no_item_per_page)
      .exec();

    res.status(HttpStatusCode.OK).json({
      message: "Get All Campaigns successfully",
      result: campaigns,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const getCampaignByStatus = async (req, res) => {
  try {
    const {
      page,
      no_item_per_page,
      search_text,
      provinceId,
      categoryId,
      status,
    } = req.body;

    const query = [];
    if (provinceId) {
      query.push({ provinceId: provinceId });
    }
    if (categoryId) {
      query.push({ categoryId: categoryId });
    }
    if (status) {
      query.push({ status: status });
    }
    if (search_text) {
      query.push({ title: { $regex: new RegExp(search_text, "i") } });
    }

    let queryMongo = {};
    if (query.length > 0) {
      queryMongo = {
        $and: [...query],
      };
    }
    const skip = (page - 1) * no_item_per_page;

    const campaigns = await Campaign.find(queryMongo)
      .skip(skip)
      .limit(no_item_per_page)
      .exec();

    res.status(HttpStatusCode.OK).json({
      message: "Get All Campaigns successfully",
      result: campaigns,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const getCampaignHome = async (req, res) => {
  try {
    const campaigns = await Campaign.find().exec();
    res.status(HttpStatusCode.OK).json({
      message: "Get All Campaigns successfully",
      result: campaigns,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};
const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    await Campaign.findByIdAndUpdate(id, {
      status: status,
    });
    res.status(HttpStatusCode.OK).json({
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Đã xảy ra lỗi",
    });
  }
};

const getCampaignByPagination = async (req, res) => {
  try {
    const { search_text, page, no_item_per_page } = req.body;
    const { status } = req.params;
    const skip = (page - 1) * no_item_per_page;

    const campaigns = await Campaign.find({
      title: { $regex: new RegExp(search_text, "i") },
      status: status,
    })
      .skip(skip)
      .limit(no_item_per_page)
      .populate("itemTypeId")
      .populate("categoryId")
      .populate("creatorId")
      .populate("provinceId")
      .exec();
    const count = await Campaign.countDocuments({
      title: { $regex: new RegExp(search_text, "i") },
      status: status,
    });
    return res.status(HttpStatusCode.OK).json({
      message: "Get campaigns successfully",
      result: campaigns,
      totalItems: count,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

export default {
  getCampaignByFilter,
  addNewCampaign,
  updateStatus,
  getAllCampaign,
  getCampaignDetail,
  getCampaignByCurrentUser,
  getCampaignByUser,
  getCampaignByStatus,
  getCampaignHome,
  getCampaignByPagination,
};
