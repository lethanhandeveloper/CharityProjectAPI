import { CampaignCategory } from "../../models/index.js";
import Exception from "../../utils/Exception.js";
import HttpStatusCode from "../../utils/HttpStatusCode.js";

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

const deleteCampaignCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    await CampaignCategory.findByIdAndDelete(id);

    res.status(HttpStatusCode.NO_CONTENT).json({
      message: " Delete Campaign Category successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const countCategoryRecords = async (req, res) => {
  try {
    const search_text = req.query.search_text
    const count = await CampaignCategory.countDocuments({ name : { $regex: new RegExp(search_text, 'i') } })
    return res.status(HttpStatusCode.OK).json({
      message: "Get campaign category records number successfully",
      result: count
    })
  } catch (error) {
    console.log(error)
    return res.json(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.INTERNAL_SERVER_ERROR
    })
  }
}

export default {
  addNewCampaignCategory,
  getAllCampaignCategory,
  deleteCampaignCategoryById,
  countCategoryRecords
};
