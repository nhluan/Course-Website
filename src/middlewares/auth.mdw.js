const auth = (req, res, next) => {
  console.log("test auth mdw");
  console.log("paath:  ", req.path);
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect("auth/login");
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.session.authUser.role !== 0) {
    return res.redirect("/");
  }
  next();
};

export { auth, isAdmin };
