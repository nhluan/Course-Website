import authRouter from "./auth.route.js";
import siteRouter from "./site.route.js";
import courseRouter from "./course.route.js";
import learnRouter from "./learn.route.js";
import searchRouter from "./search.route.js";
import profileUserRouter from "./profileUser.route.js";
import categoryRouter from "./category.route.js";
import watchListRouter from "./watchList.route.js"
import errPagerouter from "./errPage.route.js"
import { auth } from "../../middlewares/auth.mdw.js";

function route(app) {
  // app.all("*", auth);
  app.use("/auth", authRouter);
  app.use("/course", courseRouter);
  app.use("/watchList", watchListRouter); 
  app.use("/category", categoryRouter);
  app.use("/learn", learnRouter);
  app.use("/profileUser",auth, profileUserRouter);
  app.use("/search", searchRouter);
  app.use("/", siteRouter);
  // app.use("/:slug",errPagerouter);

}

export default route;
