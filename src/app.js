import express from "express";
const app = express();
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import hbsSection from "express-handlebars-sections";
import path from "path";
import flash from "connect-flash";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import defaultRoute from "./routes/default/index.route.js";
import adminRoute from "./routes/admin/index.route.js";
import activate_session_mdw from "./middlewares/session.mdw.js";
import activate_locals_mdw from "./middlewares/locals.mdw.js";
import activate_error_mdw from "./middlewares/error.mdw.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import bodyParser from "body-parser";

dotenv.config();


app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "main",
    helpers: {
      section: hbsSection(),
      sum: (a, b) => a + b,
      if_eq: (a, b, opts) => {
        if (a == b) {
          return opts.fn(this);
        } else {
          return opts.inverse(this);
        }
      },
    },
  })
);

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// console.log(path.join(__dirname));
app.use(express.static(path.join(__dirname, "public")));
// app.use('./src/public', express.static('./src/public'));
app.set("views", path.join(__dirname, "resources/views"));

activate_session_mdw(app);
app.use(flash());
activate_locals_mdw(app);

defaultRoute(app);
adminRoute(app);
activate_error_mdw(app);
//moved to route detailCourse

const port = process.env.PORT || 5000;
console.log(process.env.HOST_DB);
app.listen(port, () => console.log(`address: http://localhost:${port}`));
