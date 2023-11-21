import ItemType from "../models/ItemType.js";
import { Campaign, CampaignCategory } from "../models/index.js";
import Exception from "../utils/Exception.js";
import HttpStatusCode from "../utils/HttpStatusCode.js";
import mongoose from "mongoose";

//Campaign Category
const addNewCampaignCategory = async (req, res) => {
  try {
    const { name } = req.body;
    await CampaignCategory.create({ name });
    res.status(HttpStatusCode.CREATED).json({
      message: "Create Campaign Category successfully",
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

const getAllCampaignCategory = async (req, res) => {
  try {
    const campaigncategories = await CampaignCategory.find().exec();

    res.status(HttpStatusCode.OK).json({
      message: "Get All Campaign Category successfully",
      result: campaigncategories,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

//Item Type
const addNewItemType = async (req, res) => {
  try {
    const { name, unit } = req.body;
    await ItemType.create({ name, unit });
    res.status(HttpStatusCode.CREATED).json({
      message: "Create Item Type successfully",
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

const getAllItemType = async (req, res) => {
  try {
    const itemtypes = await ItemType.find().exec();

    res.status(HttpStatusCode.CREATED).json({
      message: "Get All Item Type successfully",
      result: itemtypes,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

// campaign
const addNewCampaign = async (req, res) => {
  try {
    const {
      creatorId,
      categoryId,
      itemTypeId,
      provinceId,
      title,
      targetValue,
      endDate,
      description,
      thumbnail,
    } = req.body;

    await Campaign.create({
      creatorId,
      categoryId: new mongoose.Types.ObjectId(categoryId),
      itemTypeId: new mongoose.Types.ObjectId(itemTypeId),
      provinceId: new mongoose.Types.ObjectId(provinceId),
      title,
      targetValue,
      endDate,
      description,
      thumbnail,
    });

    res.status(HttpStatusCode.CREATED).json({
      message: "Create Campaign successfully",
    });
  } catch (error) {
    console.log(error);
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

const getCampaignByFilter = async (req, res) => {
  try {
    const {
      page,
      no_item_per_page,
      search_text,
      provinceId,
      categoryId,
      itemTypeId,
      creatorId,
    } = req.body;

    const query = {
      $and: [
        { provinceId: provinceId },
        { categoryId: categoryId },
        { itemTypeId: itemTypeId },
        { creatorId: creatorId },
        { $or: [{ title: search_text }] },
      ],
    };

    const skip = (page - 1) * no_item_per_page;

    const campaigns = await Campaign.find(query)
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

export default {
  addNewCampaignCategory,
  getAllCampaignCategory,
  getCampaignByFilter,
  addNewItemType,
  getAllItemType,
  addNewCampaign,
  getAllCampaign,
};
