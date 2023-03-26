if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const initRoutes = require("./src/routes/index.routes");
const { routes } = require("./src/utils/utils");

// SET VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views/"));
app.set("layout", "layouts/layout");

// MIDDLEWARES
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
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

// 404
app.use((_, res) => {
  res.locals.title = "Error 404";
  res.status(404).render("errors/404");
});

// LOCALS
app.locals.activeTeams = [];
app.locals.selectedTeam;
app.locals.routes = routes;
app.locals.currentUser;

// SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
