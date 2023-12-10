import ItemType from "../../models/ItemType.js";
import Exception from "../../utils/Exception.js";
import HttpStatusCode from "../../utils/HttpStatusCode.js";

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

const deleteItemTypeById = async (req, res) => {
  try {
    const id = req.params.id;
    await ItemType.findByIdAndDelete(id);

    res.status(HttpStatusCode.NO_CONTENT).json({
      message: "Delete Item Type successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const countItemTypeRecords = async (req, res) => {
  try {
    const search_text = req.query.search_text
    const count = await ItemType.countDocuments({ name : { $regex: new RegExp(search_text, 'i') } })
    return res.status(HttpStatusCode.OK).json({
      message: "Get item type records number successfully",
      result: count
    })
  } catch (error) {
    console.log(error)
    return res.json(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.INTERNAL_SERVER_ERROR
    })
  }
}

const getItemTypeByPagination = async (req, res) => {
  try {

    const { search_text, page, no_item_per_page } = req.body;

    const skip = (page - 1) * no_item_per_page;

    const provinces = await ItemType.find({ name : { $regex: new RegExp(search_text, 'i') } })
      .skip(skip)
      .limit(no_item_per_page)
      .exec();

    return res.status(HttpStatusCode.OK).json({
      message: "Get All Item Type successfully",
      result: provinces,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

export default {
  addNewItemType,
  getAllItemType,
  deleteItemTypeById,
  countItemTypeRecords,
  getItemTypeByPagination
};
