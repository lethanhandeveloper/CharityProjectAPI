import { Commune, Province, District } from "../models/index.js";
import Exception from "../utils/Exception.js";
import HttpStatusCode from "../utils/HttpStatusCode.js";

// Communes
const getAllCommune = async (req, res) => {
  try {
    const Communes = await Commune.find().populate("districtId").exec();
    res.status(HttpStatusCode.OK).json({
      message: "Get all Communes successfully",
      result: Communes,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const addNewCommune = async (req, res) => {
  const { districtId, name } = req.body;

  try {
    await Commune.create({ districtId, name });
    res.status(HttpStatusCode.CREATED).json({
      message: "Create Commune successfully",
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

const getCommuneByDistrictId = async (req, res) => {
  try {
    const districtId = req.params.districtId;

    const communes = await Commune.find({ districtId: districtId }).exec();
    res.status(HttpStatusCode.OK).json({
      message: "Get all communes successfully",
      result: communes,
    });
  } catch (error) {
    if (error.name === Exception.CAST_ERROR) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "District id is not valid",
      });

      return;
    }

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const deleteAllCommune = async (req, res) => {
  try {
    await Commune.deleteMany();

    res.status(HttpStatusCode.OK).json({
      message: "Delete all Communes succesfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

// provinces
const addNewProvince = async (req, res) => {
  const { name } = req.body;

  try {
    await Province.create({ name });
    res.status(HttpStatusCode.OK).json({
      message: "Add a new province successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      messsage: Exception.SERVER_ERROR,
    });
  }
};

const getAllProvince = async (req, res) => {
  try {
    const provinces = await Province.find().exec();
    res.status(HttpStatusCode.OK).json({
      message: "Get all province successfully",
      result: provinces,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

// districts

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

export default {
  addNewCommune,
  getAllCommune,
  deleteAllCommune,
  addNewProvince,
  getAllProvince,
  addNewDistrict,
  getAllDistrict,
  getDistrictByProvinceId,
  getCommuneByDistrictId,
};
