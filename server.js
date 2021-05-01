const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3001;
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "twinkledb"
})

con.connect(err => {
    if (err) throw (err);
    else {
        console.log("MySQL connected");
    }
})

let tablename = "userInfo";

const queryDB = (sql) => {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post("/registerform", async(req, res) => {
    console.log(req.body);
    let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, email VARCHAR(255),password VARCHAR(100),firstname VARCHAR(100),lastname VARCHAR(100),gender VARCHAR(100),birthday VARCHAR(100))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userInfo (email, password, firstname, lastname, gender, birthday) VALUES ("${req.body.email}", "${req.body.password}", "${req.body.firstname}", "${req.body.lastname}", "${req.body.gender}", "${req.body.birthday}")`;
    result = await queryDB(sql);
    console.log("Register Success!");
    res.end();
})

app.post("/updateData", async(req, res) => {
    let sql = `UPDATE ${tablename} SET password = '${req.body.password}' WHERE email = '${req.body.email}'`;
    let result = await queryDB(sql);
    console.log(result);
    res.end("Record updated successfully");
})

app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/`);
});