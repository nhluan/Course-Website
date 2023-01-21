import bcryptjs from "bcryptjs";
import moment from "moment";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import generateToken from "../utilities/generateToken.js";
import authUlti from "../utilities/auth.js";

import userModel from "../models/account.model.js";
import verificationUserModel from "../models/verificationUser.model.js";
import resetPasswordModel from "../models/resetPasswordUser.model.js";

const APP_HOST = "localhost";
const GOOGLE_MAILER_CLIENT_ID =
  "731538531847-m5v94ske1bj06an4ekt86aki0ofe9fei.apps.googleusercontent.com";
const GOOGLE_MAILER_CLIENT_SECRET = "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";
const GOOGLE_MAILER_REFRESH_TOKEN =
  "1//04hAaB-fi8tQtCgYIARAAGAQSNwF-L9IrOkg83lS5G0AfIk1vxIOrdU59KQ5_vT8Rxe5p8xtMx5xm0ZL8JUx0B1AicIkYjmgNgws";
const ADMIN_EMAIL_ADDRESS = "ats.courseacedemy@gmail.com";
const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
);
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
});
const myAccessTokenObject = await myOAuth2Client.getAccessToken();
// Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
const myAccessToken = myAccessTokenObject.token;
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: ADMIN_EMAIL_ADDRESS,
    clientId: GOOGLE_MAILER_CLIENT_ID,
    clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
    refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
    accessToken: myAccessToken,
  },
});

const sendVerificationEmail = async (email, res) => {
  console.log("sendVerificationEmail");
  try {
    const myOAuth2Client = new OAuth2Client(
      GOOGLE_MAILER_CLIENT_ID,
      GOOGLE_MAILER_CLIENT_SECRET
    );
    // Set Refresh Token vào OAuth2Client Credentials
    myOAuth2Client.setCredentials({
      refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
    });
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
    const myAccessToken = myAccessTokenObject.token;

    // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });

    // const currentUrl = "http://" + req.headers.host + req.url;
    const token = generateToken();
    const strMail = `http://${APP_HOST}:3000/auth/verify/${email}/${token}`;
    const mailOptions = {
      to: email, // Gửi đến ai?
      subject: "Verify", // Tiêu đề mail
      html: `Click <a href="http://${APP_HOST}:3000/auth/verify/${email}/${token}">here</a> to verify your email`, // Nội dung mail dạng html
    };
    //hash token
    const saltRounds = bcryptjs.genSaltSync(10);
    const tokenHashed = bcryptjs.hashSync(token, saltRounds);
    const vertificationUser = {
      email: email,
      token: tokenHashed,
      createAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      expiredAt: moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
    };
    verificationUserModel
      .add(vertificationUser)
      .then(() =>
        transport
          .sendMail(mailOptions)
          .then(
            () => res.redirect("login")
            // res.status(200).json({ message: "Email sent successfully." })
          )
          .catch((err) => console.log(err))
      )
      .catch((err) => console.log(err));
    // Thực hiện gửi mail
    // const result = await transport.sendMail(mailOptions);
    // return result;
  } catch (error) {
    return error;
  }
};
const signup = async (req, res) => {
  if (req.method == "GET") {
    res.render("signUp", { layout: false });
  }
  if (req.method == "POST") {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const saltRounds = bcryptjs.genSaltSync(10);
    const passHashed = bcryptjs.hashSync(password, saltRounds);
    const dob = moment(req.body.dob, "DD/MM/YYYY").format("YYYY-MM-DD");

    const acc = {
      // id_: "001",
      name_user: username,
      email: email,
      password: passHashed,
      date_of_birth: dob,
      role: 2,
    };
    await userModel
      .addUser(acc)
      .then(async (result) => {
        await sendVerificationEmail(email, res);
      })
      .catch((err) => console.log(err + " + " + " err save account to db "));
    // res.redirect("/auth/signup", { layout: false });

    // res.status(200).json({ message: "errrrrrrr" });
  }
};

const verify = async (req, res) => {
  let err = false;
  const { email, token } = req.params;
  await verificationUserModel
    .findByEmail(email)
    .then(async (result) => {
      //khuc nay bot viet?ao?
      if (result.length === 0) {
        res.render("verified", {
          err: true,
          message: "invalid email or has been verified. please sign up again",
          layout: false,
        });
      } else {
        if (moment().isAfter(result.expiredAt)) {
          await verificationUserModel
            .deleteByEmail(email)
            .then(() => {
              res.render("verified", {
                err: true,
                message: "link has expired. please sign up again",
                layout: false,
              });
            })
            .catch((err) => console.log(err));
        } else {
          if (bcryptjs.compareSync(token, result[0].token)) {
            userModel
              .updateStatus(email)
              .then(() => {
                verificationUserModel
                  .deleteByEmail(email)
                  .then(() => {
                    res.render("verified", {
                      err: false,
                      message: "please login to continue",
                      layout: false,
                    });
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          } else {
            res.render("verified", {
              err: true,
              message:
                "invalid token or has been verified please sign up again",
              layout: false,
            });
          }
        }
      }
    })
    .catch((err) => console.log(err));
};

const verified = async (req, res) => {
  res.render("verified", { err: false, message: "success", layout: false });
};

const login = async (req, res) => {
  if (req.method == "GET") {
    return res.render("login", { layout: false });
  } else if (req.method == "POST") {
    await userModel
      .findByEmailUser(req.body.email)
      .then((result) => {
        if (result.length === 0) {
          res.render("login", {
            layout: false,
            error: true,
            message: "Invalid email or password",
          });
        } else {
          if (bcryptjs.compareSync(req.body.password, result[0].password)) {
            if (result[0].verified === 0) {
              res.render("login", {
                layout: false,
                error: true,
                message: "Please verify your email",
              });
            } else if (result[0].active === 0) {
              res.render("login", {
                layout: false,
                error: true,
                message: "your account has been locked",
              });
            } else {
              delete result[0].password;
              req.session.auth = true;
              req.session.authUser = result[0];
              const dob = moment(result[0].date_of_birth, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              );
              console.log("dob:", dob);
              req.session.authUser.date_of_birth = dob;
              let url = "";
              url = result[0].role == 0 ? "/admin" : req.session.retUrl || "/";
              res.redirect(url);
            }
          } else {
            res.render("login", {
              layout: false,
              error: true,
              message: "Invalid email or password",
            });
          }
        }
      })
      .catch((e) => console.log(e));
  }
};

const logout = async (req, res) => {
  console.log("LOGOUT");
  req.session.destroy(function (err) {
    const url = "/";
    return res.redirect(url);
  });
};
const isExist = async (req, res) => {
  await userModel
    .findByEmailUser(req.query.email)
    .then((result) => {
      if (result.length === 0) {
        res.json(false);
      } else {
        res.json(true);
      }
    })
    .catch(() => {
      (e) => console.log(e);
    });
};

// const deleteFullAccount = async (req, res) => {
//   console.log("delete");
//   await userModel.deleteAllUser();
//   res.json("susscessfully");
// };

const sendResetEmail = async ({ email }, res) => {
  const token = generateToken();
  console.log("email reset", email);
  //delete all reset existing
  await resetPasswordModel
    .deleteByEmail(email)
    .then(async () => {
      const mailOptions = {
        to: email, //
        subject: "Reset password", // Tiêu đề mail
        html: `Click <a href="http://${APP_HOST}:3000/auth/resetPassword/${email}/${token}">here</a> to reset your password`, // Nội dung mail dạng html
      };
      const saltRounds = 10;
      const hashedToken = bcryptjs.hashSync(token, saltRounds);
      const entity = {
        email: email,
        token: hashedToken,
        createAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        expiredAt: moment().add(30, "minutes").format("YYYY-MM-DD HH:mm:ss"),
      };
      await resetPasswordModel
        .add(entity)
        .then(() => {
          transport.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
              res.render("forgotPassword", {
                layout: false,
                error: true,
                message: "error when sending email",
              });
            } else {
              // console.log(info);
              res.render("forgotPassword", {
                layout: false,
                error: false,
                email: email,
              });
            }
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

const requestPasswordReset = async (req, res) => {
  const email = req.body.email;
  if (req.method === "GET") {
    res.render("forgotPassword", { layout: false });
  }
  if (req.method === "POST") {
    await userModel
      .findByEmailUser(email)
      .then((result) => {
        if (result.length) {
          //user exist
          if (!result[0].verified) {
            res.render("forgotPassword", {
              layout: false,
              error: true,
              message: "email hasn't been verified yet. Check email please",
            });
          } else {
            sendResetEmail(result[0], res);
          }
        } else {
          res.render("forgotPassword", {
            layout: false,
            error: true,
            message: "email doesn't exist",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
function isValidPass(password) {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return regex.test(password);
}

const resetPassword = async (req, res) => {
  const { password, rePassword } = req.body;
  const { email, token } = req.params;
  if (req.method === "GET") {
    return res.render("newPassword", { layout: false });
  }
  if (req.method === "POST") {
    if (password === "") {
      return res.render("newPassword", {
        layout: false,
        error: true,
        message: "password can't be empty",
      });
    } else if (!authUlti.isValidPass(password)) {
      return res.render("newPassword", {
        layout: false,
        error: true,
        message:
          "password must be 6-20 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
      });
    } else {
      if (password !== rePassword) {
        return res.render("newPassword", {
          layout: false,
          error: true,
          message: "password doesn't match",
        });
      } else {
        await resetPasswordModel
          .findByEmail(email)
          .then(async (result) => {
            if (result.length === 0) {
              return res.render("newPassword", {
                layout: false,
                error: true,
                message: "password reset link is invalid or has expired",
              });
            } else {
              if (moment().isAfter(result[0].expiredAt)) {
                await resetPasswordModel
                  .deleteByEmail(email)
                  .then(() => {
                    return res.render("newPassword", {
                      layout: false,
                      error: true,
                      message: "password reset link  has expired",
                    });
                  })
                  .catch((e) => console.log(e));
              } else {
                if (bcryptjs.compareSync(token, result[0].token)) {
                  const saltRounds = 10;
                  const hashedPassword = bcryptjs.hashSync(
                    password,
                    saltRounds
                  );
                  await userModel
                    .updatePassword(email, hashedPassword)
                    .then(async () => {
                      await resetPasswordModel
                        .deleteByEmail(email)
                        .then((e) => {
                          return res.redirect("/auth/login");
                        })
                        .catch((e) => console.log(e));
                    })
                    .catch((e) => console.log(e));
                } else {
                  res.render("newPassword", {
                    layout: false,
                    error: true,
                    message: "password reset link is invalid or has expired",
                  });
                }
              }
            }
          })
          .catch((e) => console.log(e));
      }
    }
  }
};

export default {
  signup,
  login,
  logout,
  isExist,
  verified,
  verify,
  requestPasswordReset,
  resetPassword,
};
