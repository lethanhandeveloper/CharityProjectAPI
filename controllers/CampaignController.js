// import { Commune, Province, District } from "../models/index.js"
// import Exception from "../utils/Exception.js"
// import HttpStatusCode from '../utils/HttpStatusCode.js'

// // Communes
// const getAllCommune = async (req, res) => {
//     try {
//         const Communes = await Commune.find().populate('districtId').exec()
//         res.status(HttpStatusCode.OK).json({
//             message: "Get all Communes successfully",
//             result: Communes
//         })
//     } catch (error) {
//         res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
//             message: "Server is error",
//         })
//     }
// } 


// export default {
//     addNewCommune,
//     getAllCommune,
//     deleteAllCommune,
//     addNewProvince,
//     getAllProvince,
//     addNewDistrict,
//     getAllDistrict
// }