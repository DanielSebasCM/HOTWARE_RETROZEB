require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const schedule = require("node-schedule");
const initRoutes = require("./src/routes/index.routes");
const { routes } = require("./src/utils/constants");
const { privileges } = require("./src/utils/constants");
const errorHandler = require("./src/middlewares/errorHandler");

// SET VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views/"));
app.set("layout", "layouts/layout");

// MIDDLEWARES
app.use(
  cors({
    origin: ["https://padawan-1.laing.mx", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(
  session({
    // CREATE NEW UNIQUE SECRET AND SAVE
    // TO CREATE IT, RUN THIS CODE IN THE TERMINAL:
    // node
    // require("crypto").randomBytes(64).toString("hex")
    secret:
      "0168ca0eeb6a22290e3b2988dd2e0c5f097c8a8ec4c77dcc5168774bdacb4a89146f3aed08c5812a39c6d329c4422d4446ea3a24e769dd4006e12d29384c49f5",
    resave: false,
    saveUninitialized: false,
  })
);

// ROUTER
initRoutes(app);

// TODO - ADD DASHBOARD
app.get("/", (req, res) => {
  res.redirect("/retrospectivas");
});

// 404
app.use((req, res) => {
  res.locals.errorView = true;
  res.status(404).render("errors/404", {
    title: "Error 404",
    message: `Página no encontrada: ${req.url}`,
  });
});

// ERROR HANDLER
app.use(errorHandler);

// LOCALS
app.locals.routes = routes;
app.locals.layout = true;
app.locals.privileges = privileges;

// NODE SCHEDULE
const Sprint = require("./src/models/sprint.model");
schedule.scheduleJob("0 * * * *", async () => {
  console.log("Sync Jira");
  try {
    await Sprint.syncJira();
  } catch (err) {
    console.log(err);
  }
});

// SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
