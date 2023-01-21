import userRouter from "./user.route.js";
import siteRouter from "./site.route.js";
import courseRouter from "./course.route.js";
import categoryRouter from "./category.route.js";
import { auth, isAdmin } from "../../middlewares/auth.mdw.js";

function route(app) {
  app.use("/admin/user", userRouter);
  app.use("/admin/course", courseRouter);
  app.use("/admin/category", categoryRouter);
  app.use("/admin",auth, isAdmin, siteRouter);
}

export default route;

// router.all('/*', (req, res, next) => {

//     req.app.locals.layout = 'admin';

//     next();
// });
