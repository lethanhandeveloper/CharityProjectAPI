import fs from "fs";
import { generateRandomCode } from "../utils/Number.js";
import nodemailer from "nodemailer";
import ejs from "ejs";
import { OAuth2Client } from "google-auth-library";

async function sendEmailByType(data, type) {
  const { toEmail } = data;
  const myOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_MAILER_CLIENT_ID,
    process.env.GOOGLE_MAILER_CLIENT_SECRET
  );
  // Set Refresh Token vào OAuth2Client Credentials
  myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
  });

  try {
    // Lấy thông tin gửi lên từ client qua body
    // const { email, subject, content } = req.body
    // if (!email || !subject || !content) throw new Error('Please provide email, subject and content!')
    /**
     * Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
     * Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
     */
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
    const myAccessToken = myAccessTokenObject?.token;
    // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.ADMIN_EMAIL_ADDRESS,
        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
        clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });
    // mailOption là những thông tin gửi từ phía client lên thông qua API
    let title = { name: "", template: "" };
    switch (type) {
      case "Password":
        title.name = "Mã lấy mật khẩu";
        title.template = "./templates/forgotPass.ejs";
        break;
      case "Register":
        title.name = "Đăng ký thành công";
        title.template = "./templates/registrationcodeemail.ejs";
        break;
      case "Withdaw":
        title.name = "Thông báo rút tiền";
        title.template = "./templates/request.ejs";
        break;
      case "Finish":
        title.name = "Thông báo kết thúc chiến dịch";
        title.template = "./templates/donate.ejs";
        break;
      case "Cancel":
        title.name = "Thông báo hủy chiến dịch";
        title.template = "./templates/cancel.ejs";
        break;
      case "Donate":
        title.name = "Thông báo ủng hộ";
        title.template = "./templates/donate.ejs";
        break;
      case "Reject":
        title.name = "Thông báo hủy yêu cầu";
        title.template = "./templates/reject.ejs";
        break;
      default:
        break;
    }
    const emailTemplate = await fs.readFileSync(title.template, "utf8");

    const renderedHtml = ejs.render(emailTemplate, data);

    const mailOptions = {
      to: toEmail, // Gửi đến ai?
      subject: title.name, // Tiêu đề email
      html: renderedHtml,
    };
    // Gọi hành động gửi email
    await transport.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}

export { sendEmailByType };
