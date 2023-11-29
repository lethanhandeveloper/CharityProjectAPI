import Exception from "../../utils/Exception.js";
import HttpStatusCode from "../../utils/HttpStatusCode.js";

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
    const provinceId = req.params.id;
    const districts = await District.find({ provinceId });
    Promise.all(
      districts.forEach(async (district) => {
        await Commune.findOneAndDelete({ districtId: district._id });
        await District.findByIdAndDelete(district._id);
      })
    );

    await Province.findByIdAndDelete(districtId);

    res.status(HttpStatusCode.NO_CONTENT).json({
      message: "Delete province successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: Exception.SERVER_ERROR,
    });
  }
};

const updateProvinceById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    await Province.findByIdAndUpdate(id, { name });

    res.status(HttpStatusCode.OK).json({
      message: "Update province successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};
export default {
  addNewProvince,
  deleteProvinceById,
  getAllProvince,
  updateProvinceById,
};
