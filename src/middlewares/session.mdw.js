import session from "express-session";
import fMySQLStore from "express-mysql-session";
import { connection } from "./../utilities/database.js";
export default function (app) {
  const MySQLStore = fMySQLStore(session);
  const option = {
    ...connection,
    clearExpired: true,
    checkExpirationInterval: 300000, //30 seconds
    expiration: 1000,
  };
  const sessionStore = new MySQLStore(option);

  app.set("trust proxy", 1);
  app.use(
    session({
      secret: "atsatsats",
      resave: false,
      store: sessionStore,
      saveUninitialized: true,
      // Session expires after 1 min of inactivity.
      cookie: { maxAge: 1000 * 60 * 60 },
    })
  );
}
