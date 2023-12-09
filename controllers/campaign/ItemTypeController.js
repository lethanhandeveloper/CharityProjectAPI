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
    const count = await ItemType.countDocuments()
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

export default {
  addNewItemType,
  getAllItemType,
  deleteItemTypeById,
  countItemTypeRecords
};
