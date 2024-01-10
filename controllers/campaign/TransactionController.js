import { DonationTransactionHash } from "../../models/index.js";
import Exception from "../../utils/Exception.js";
import HttpStatusCode from "../../utils/HttpStatusCode.js";

const addNewDonationTransactionHash = async (req, res) => {
  try {
    const { transactionHash, transactionId } = req.body;
    await DonationTransactionHash.create({ transactionHash, transactionId });
    await DonationTransactionHash.create({
      transactionHash:
        "0xb844394ad1cf157915bf2d66ece553fb4a016f029950ad5a9e3dc8f9b47ea835",
      transactionId:
        "0xed62fb5739f816e5f8a45c40f5fb10dba3c7e4761aea22ebb9e8dfa59ac6b809",
    });
    await DonationTransactionHash.create({
      transactionHash:
        "0xbf9999924b510eb2621b703ad6d66f8b4e288174a2322c41f449a0db45f26120",
      transactionId:
        "0x62b16be0c35b759f7159002faf70318e2507f6544829772f04873dd22e5aa09e",
    });
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
    const donationtransactionhash_list = await DonationTransactionHash.findOne({
      transactionId,
    });
    res.status(HttpStatusCode.OK).json({
      message: "Get donation transaction hash successfully",
      result: donationtransactionhash_list,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Server is error",
    });
  }
};

export default {
  addNewDonationTransactionHash,
  getDonationTransactionHashByTransactionId,
};
