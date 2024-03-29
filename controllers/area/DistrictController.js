import Exception from "../../utils/Exception.js";
import HttpStatusCode from "../../utils/HttpStatusCode.js";
import District from "../../models/District.js";

const addNewDistrict = async (req, res) => {
  try {
    const { provinceId, name } = req.body;

    await District.create({
      provinceId,
      name,
    });

    res.status(HttpStatusCode.CREATED).json({
      message: "Create a new district successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid data",
      });

      return;
    }

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const getAllDistrict = async (req, res) => {
  try {
    const districts = await District.find().populate("provinceId").exec();
    res.status(HttpStatusCode.OK).json({
      message: "Get all district successfully",
      result: districts,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const getDistrictByProvinceId = async (req, res) => {
  try {
    const provinceId = req.params.provinceId;

    const districts = await District.find({ provinceId: provinceId }).exec();
    res.status(HttpStatusCode.OK).json({
      message: "Get all district successfully",
      result: districts,
    });
  } catch (error) {
    if (error.name === Exception.CAST_ERROR) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Province id is not valid",
      });

      return;
    }

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const deleteDistrictbyId = async (req, res) => {
  try {
    const districtId = req.params.id;

    await Commune.findOneAndDelete({ districtId });
    await District.findByIdAndDelete(districtId);

    res.status(HttpStatusCode.NO_CONTENT).json({
      message: "Delete district successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const updateDistrictById = async (req, res) => {
  try {
    const { name, provinceId, id } = req.body;

    await District.findByIdAndUpdate(id, { name, provinceId });

    res.status(HttpStatusCode.OK).json({
      message: "Update district successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Your data is not valid",
      });
    }

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const getDistrictByPagination = async (req, res) => {
  try {
    const { search_text, page, no_item_per_page } = req.body;

    const skip = (page - 1) * no_item_per_page;

    const districts = await District.find({
      name: { $regex: new RegExp(search_text, "i") },
    })
      .skip(skip)
      .limit(no_item_per_page)
      .exec();
    const count = await District.countDocuments({
      name: { $regex: new RegExp(search_text, "i") },
    });
    return res.status(HttpStatusCode.OK).json({
      message: "Get All Districts successfully",
      result: districts,
      totalItems: count,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const getDistrictByName = async (req, res) => {
  try {
    const name = req.params.name;
    const districts = await District.find({ name: new RegExp(name, "i") });
    res.status(HttpStatusCode.OK).json({
      message: "Get all Districts successfully",
      result: districts,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

export default {
  addNewDistrict,
  deleteDistrictbyId,
  getAllDistrict,
  getDistrictByProvinceId,
  updateDistrictById,
  getDistrictByPagination,
  getDistrictByName,
};
