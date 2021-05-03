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
    res.end("true");
})

app.post("/loginform", async(req, res) => {
    let sqldata = `SELECT email,password FROM userInfo WHERE email = '${req.body.email}'`;
    let resultdata = await queryDB(sqldata);

    console.log(resultdata);

    if (resultdata != "") {
        console.log(resultdata[0].email + " = " + req.body.email);
        console.log(resultdata[0].password + " = " + req.body.password);

        if (resultdata[0].email == req.body.email) {
            if (resultdata[0].password == req.body.password) {
                console.log("Login success");
                res.end("true");
            } else {
                console.log("Email or Password not correct");
                res.end("false");
            }
        } else {
            console.log("Email or Password not correct");
            res.end("false");
        }
    } else {
        console.log("null");
        res.end("null");
    }
})

app.post("/resetPassword", async(req, res) => {
    let sql = `UPDATE ${tablename} SET password = '${req.body.password}' WHERE email = '${req.body.email}'`;
    let result = await queryDB(sql);
    console.log(result);
    res.end("Record updated successfully");
})

let postdata = null;

app.post("/submitpost", async(req, res) => {
    //console.log(req.body);
    writePost(req.body);
    postdata = await readPost();
    console.log("Send data to client!")
    res.end(postdata);
})

app.get("/readallpost", async(req, res) => {
    postdata = await readPost();
    console.log("Send data to client!")
    res.end(postdata);
})

const writePost = async(data) => {
    return new Promise((resolve, rejects) => {
        //console.log(data);
        let sql = "CREATE TABLE IF NOT EXISTS postInfo (id INT AUTO_INCREMENT PRIMARY KEY, post_date TIMESTAMP, username VARCHAR(255),post VARCHAR(255),like_count VARCHAR(100))";
        let result = queryDB(sql);
        sql = `INSERT INTO postInfo (username, post, like_count) VALUES ("${data.username}", "${data.post}", "${data.likecount}")`;
        result = queryDB(sql);
        console.log("Post Success!");
        resolve("Post Success!");
    })
}

const readPost = async() => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM postInfo", function(err, result, fields) {
            if (err) {
                console.log(err);
                resolve(JSON.stringify("No post found", null, "\t"));
                reject(err);
            } else {
                console.log("Read Success!");
                resolve(JSON.stringify(result, null, "\t"));
            }
        })
    })
}

app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/`);
});