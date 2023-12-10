import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model(
  "PersonalGeneralInfo",
  new Schema({
    id: { type: ObjectId },
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    representativeEmail: {
      type: String,
      required: true,
    },
    socialNetworkLink: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    // 1 : sang lap, 2: chu nhiem, 3 quan ly tai chinh
    roleOnClub: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
    },
    clubName: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    /*
            1 Tổ chức chính trị xã hội (Công đoàn, thanh niên, phụ nữ, nông dân, cựu chiến binh . . .)
            2 Tổ chức xã hội (ví dụ Hội Chữ thập đỏ)
            3 Tổ chức xã hội nghề nghiệp
            4 Tổ chức tôn giáo
            5 Tổ chức kinh tế, Doanh nghiệp
        */
    underOrg: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    actionDescSocialLink: {
      type: String,
      required: true,
    },
    achivementDoc: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  })
);
