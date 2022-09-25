const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");
function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      name: "",
      street: "",
      postal: "",
      city: "",
    };
  }
  res.render("customer/auth/signup", { inputData: sessionData });
}
async function signup(req, res, next) {
  // ..
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    name: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Input is invalid -- PLease cheack your input",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const existAlready = await user.existAlready();
    if (existAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User already exist! Try loging in instead!",
          ...enteredData,
        },
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect("/login");
}
function getLogin(req, res) {
  // ..
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("customer/auth/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);

  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }
  const sessionErorData = {
    errorMessage:
      "Invalid credentials - please double-check your email and password",
    email: req.body.email,
    password: req.body.password,
  };
  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErorData, function () {
      res.redirect("/login");
    });
    return;
  }
  const posswordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );
  if (!posswordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErorData, function () {
      res.redirect("/login");
    });
    return;
  }
  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
