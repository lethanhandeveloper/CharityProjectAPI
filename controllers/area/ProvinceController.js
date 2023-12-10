import Exception from "../../utils/Exception.js";
import HttpStatusCode from "../../utils/HttpStatusCode.js";
import Province from "../../models/Province.js";

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

const getProvinceByPagination = async (req, res) => {
  try {

    const { search_text, page, no_item_per_page } = req.body;

    const skip = (page - 1) * no_item_per_page;

    const provinces = await Province.find({ name : { $regex: new RegExp(search_text, 'i') } })
      .skip(skip)
      .limit(no_item_per_page)
      .exec();

    return res.status(HttpStatusCode.OK).json({
      message: "Get All Provinces successfully",
      result: provinces,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const getProvinceByName = async (req, res) => {
  try {
    const name = req.params.name;
    const provinces = await Province.find({ name: new RegExp(name, "i") });
    res.status(HttpStatusCode.OK).json({
      message: "Get all Provinces successfully",
      result: provinces,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

const countProvinceRecords = async (req, res) => {
  try {
    const search_text = req.query.search_text
    const count = await Province.countDocuments({ name : { $regex: new RegExp(search_text, 'i') } })
    return res.status(HttpStatusCode.OK).json({
      message: "Get province records number successfully",
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
  addNewProvince,
  deleteProvinceById,
  getAllProvince,
  updateProvinceById,
  getProvinceByPagination,
  getProvinceByName,
  countProvinceRecords
};
