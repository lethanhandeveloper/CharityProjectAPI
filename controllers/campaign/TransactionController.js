import { DonationTransactionHash } from "../../models/index.js";
import Exception from "../../utils/Exception.js";
import HttpStatusCode from "../../utils/HttpStatusCode.js";

const addNewDonationTransactionHash = async (req, res) => {
    try {
        const { transactionHash, transactionId } = req.body;
        await DonationTransactionHash.create({ transactionHash, transactionId });
        res.status(HttpStatusCode.CREATED).json({
            message: "Create donation transaction hash successfully",
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

const getDonationTransactionHashByTransactionId = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const donationtransactionhash_list = await DonationTransactionHash.findOne({ transactionId });
        res.status(HttpStatusCode.OK).json({
            message: "Get donation transaction hash successfully",
            result: donationtransactionhash_list
        });
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Server is error",
        });
    }
};

export default {
    addNewDonationTransactionHash,
    getDonationTransactionHashByTransactionId
};
