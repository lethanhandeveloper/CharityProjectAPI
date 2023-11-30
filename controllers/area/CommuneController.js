// Communes
import Exception from "../../utils/Exception.js";
import HttpStatusCode from "../../utils/HttpStatusCode.js";
import Commune from "../../models/Commune.js";
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

const deleteCommuneById = async (req, res) => {
  try {
    const communeId = req.params.id;
    await Commune.findByIdAndDelete(communeId);

    res.status(HttpStatusCode.NO_CONTENT).json({
      message: "Delete district successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.OK).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const updateCommuneById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, districtId } = req.body;

    await Commune.findByIdAndUpdate(id, { name, districtId });

    res.status(HttpStatusCode.OK).json({
      message: "Update commune successfully",
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
export default {
  addNewCommune,
  deleteAllCommune,
  deleteCommuneById,
  getAllCommune,
  getCommuneByDistrictId,
  updateCommuneById,
};
