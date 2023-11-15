import HttpStatusCode from "../utils/HttpStatusCode.js";

const getMapList = async (req, res) => {
  try {
    const data = [
      { lat: "21.02776440", long: "105.83415980", idRecord: "" },
      { lat: "16.047079", long: "108.206230", idRecord: "" },
      { lat: "10.762622", long: "106.660172", idRecord: "" },
    ];
    res.status(HttpStatusCode.OK).json({
      data: data,
      message: "Success",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};
const addNewMap = async (req, res) => {
  try {
    //create Map
    //req {lat,long,idRecord}
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};
const updateMap = async (req, res) => {
  try {
    //update Map
    //req {lat,long,idRecord}
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};
export default {
  getMapList,
  addNewMap,
  updateMap,
};
