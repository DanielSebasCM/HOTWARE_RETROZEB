if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

let express = require("express");
let app = express();
let path = require("path");
const expressLayouts = require("express-ejs-layouts");

let PORT = process.env.PORT || 3000;

// SET VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views/"));
app.set("layout", "layouts/layout");

// MIDDLEWARES
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);

// ROUTES
app.get("/", (_, res) => {
  res.redirect("/login");
});

app.get("/login", (_, res) => {
  res.render("index", { title: "Login" });
});

app.get("/dashboard", (_, res) => {
  res.render("dashboard", { title: "Dashboard", user: "Hotware" });
});

// SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

// 404
app.use((_, res) => {
  res.locals.title = "Error 404";
  res.status(404).render("404/index");
});
