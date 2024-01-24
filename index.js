const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql2");
const methodOverride = require("method-override");
const { faker } = require("@faker-js/faker");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const connection = mysql.createConnection({
  user: "root",
  host: "localhost",
  database: "XEMP",
  password: "Pr@kash21#",
});

app.get("/", (req, res) => {
  let q = `SELECT COUNT(*) FROM XEMP`;
  try {
    connection.query(q, (err, result) => {
      let count = result[0]["COUNT(*)"];
      res.render("Home.ejs", { count });
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/user", (req, res) => {
  let q = `SELECT * FROM XEMP`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result;
      res.render("user.ejs", { user });
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/user/add", (req, res) => {
  res.render("add.ejs");
});

app.post("/user/add", (req, res) => {
  let { username, email, password } = req.body;
  let id = faker.string.uuid();
  let date = faker.date.recent();
  let q = `INSERT INTO XEMP (ID,EMAIL,USERNAME,PASSWORD,DATE) VALUES (?,?,?,?,?)`;
  connection.query(q, [id, email, username, password, date], (err, result) => {
    if (err) throw err;
    res.redirect("/user");
  });
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM XEMP WHERE ID = "${id}"`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (error) {
    console.log(error);
  }
});
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { username: new_username, password: user_Pass } = req.body;
  let q = `SELECT * FROM XEMP WHERE ID = "${id}"`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let { PASSWORD } = result[0];
      if (PASSWORD !== user_Pass) {
        res.send("Wrong pass");
      } else {
        let q = `UPDATE XEMP SET USERNAME = "${new_username}" WHERE ID ="${id}"`;
        connection.query(q, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM XEMP WHERE ID = "${id}"`;
  try {
    connection.query(q, (err, result) => {
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let { email, password } = req.body;
  let q = `SELECT * FROM XEMP WHERE ID = "${id}"`;
  try {
    connection.query(q, (err, result) => {
      let { EMAIL, PASSWORD } = result[0];
      if (PASSWORD === password && EMAIL === email) {
        let q = `DELETE FROM XEMP WHERE ID = "${id}"`;
        connection.query(q, (err, result) => {
          res.redirect("/user");
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(4040);
