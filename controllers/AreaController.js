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

const deleteCommuneById = async (req, res) => {
  try {
    const communeId = req.params.id
    await Commune.findByIdAndDelete(communeId)

    res.status(HttpStatusCode.NO_CONTENT).json({
      message: "Delete district successfully"
    })
  } catch (error) {
    res.status(HttpStatusCode.OK).json({
      message: Exception.SERVER_ERROR,
    });
  }
}

const updateCommuneById = async (req, res) => {
  try {
    const id  = req.params.id
    const { name, districtId } = req.body

    await Commune.findByIdAndUpdate(id, { name, districtId })

    res.status(HttpStatusCode.OK).json({
      message: "Update commune successfully"
    })
  } catch (error) {
    if(error.name === 'CastError'){
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Your data is not valid",
      });
    }

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
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

const deleteProvinceById = async (req, res) => {
  try {
    const provinceId = req.params.id
    const districts = await District.find({ provinceId })
    Promise.all(
      districts.forEach(async district => {
        await Commune.findOneAndDelete({ districtId: district._id})
        await District.findByIdAndDelete(district._id)
      })
    )
    
    await Province.findByIdAndDelete(districtId)

    res.status(HttpStatusCode.NO_CONTENT).json({
      message: "Delete province successfully"
    })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
}

const updateProvinceById = async (req, res) => {
  try {
    const id = req.params.id
    const { name } = req.body

    await Province.findByIdAndUpdate(id, { name })

    res.status(HttpStatusCode.OK).json({
      message: "Update province successfully"
    })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
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

const deleteDistrictbyId = async (req, res) => {
  try {
    const districtId = req.params.id

    await Commune.findOneAndDelete({ districtId })
    await District.findByIdAndDelete(districtId)

    res.status(HttpStatusCode.NO_CONTENT).json({
      message: "Delete district successfully"
    })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
}

const updateDistrictById = async (req, res) => {
  try {
    const id  = req.params.id
    const { name, provinceId } = req.body

    await District.findByIdAndUpdate(id, { name, provinceId })

    res.status(HttpStatusCode.OK).json({
      message: "Update district successfully"
    })
  } catch (error) {
    if(error.name === 'CastError'){
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
  getAllCommune,
  getCommuneByDistrictId,
  deleteAllCommune,
  deleteCommuneById,
  updateCommuneById,
  addNewProvince,
  getAllProvince,
  deleteProvinceById,
  updateProvinceById,
  addNewDistrict,
  getAllDistrict,
  getDistrictByProvinceId,
  deleteDistrictbyId,
  updateDistrictById
};
