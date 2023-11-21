import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model('SurveyInfoVerification', 
    new Schema({
        id: {type: ObjectId},
        /*
            Momo
            VinID
            Grab
            Kickstarter
            Mục khác:
        */
        optionOne: {
            type: Boolean
        },
        optionTwo: {
            type: Boolean
        },
        optionThree: {
            type: Boolean
        },
        optionFour: {
            type: Boolean
        },
        optionFive: {
            type: String
        },
// Nghị định 93/2021/NĐ-CP về vận động, tiếp nhận, phân phối và sử dụng các nguồn đóng góp tự nguyện hỗ trợ khắc phục khó khăn do thiên tai, dịch bệnh, sự cố; hỗ trợ bệnh nhân mắc bệnh hiểm nghèo

// Nghị định 93/2019/NĐ-CP về tổ chức, hoạt động của quỹ xã hội, quỹ từ thiện

// Nghị định 45/2010/NĐ-CP quy định về tổ chức, hoạt động và quản lý hội

// Thông tư 41/2022/TT-BTC hướng dẫn Chế độ kế toán áp dụng cho các hoạt động xã hội, từ thiện các quy định pháp luật liên quan

// Không biết quy định pháp luật này liên quan
        lawOneOption: {
            type: Boolean,
            required: true
        },
        lawTwoOption: {
            type: Boolean,
            required: true
        },
        lawThreeOption: {
            type: Boolean,
            required: true
        },
        lawFourOption: {
            type: Boolean,
            required: true
        },
        lawFiveOption: {
            type: Boolean,
            required: true
        },
        chanel: {
            type: Number,
            enum: [1, 2, 3, 4],
            required: true
        }
    })
)