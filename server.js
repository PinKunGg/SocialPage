const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3001;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

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

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'img/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

app.post("/registerform", async(req, res) => {
    console.log(req.body);
    let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, email VARCHAR(255),password VARCHAR(100),firstname VARCHAR(100),lastname VARCHAR(100),gender VARCHAR(100),birthday VARCHAR(100),profilepic VARCHAR(255))";
    let result = await queryDB(sql);
    let sqldata = `SELECT email FROM userInfo WHERE email = '${req.body.email}'`;
    let resultdata = await queryDB(sqldata);

    if (resultdata == "") {
        sql = `INSERT INTO userInfo (email, password, firstname, lastname, gender, birthday, profilepic) VALUES ("${req.body.email}", "${req.body.password}", "${req.body.firstname}", "${req.body.lastname}", "${req.body.gender}", "${req.body.birthday}","${req.body.profilepic}")`;
        result = await queryDB(sql);
        console.log("Register Success!");
        res.end("true");
    } else {
        console.log("same_eamil");
        res.end(JSON.stringify("same_eamil"));
    }
})

app.post("/loginform", async(req, res) => {
    let sqldata = `SELECT email,password,firstname,profilepic FROM userInfo WHERE email = '${req.body.email}'`;
    let resultdata = await queryDB(sqldata);

    console.log(resultdata);

    if (resultdata != "") {
        console.log(resultdata[0].email + " = " + req.body.email);
        console.log(resultdata[0].password + " = " + req.body.password);

        if (resultdata[0].email == req.body.email) {
            if (resultdata[0].password == req.body.password) {
                res.cookie('username', resultdata[0].firstname, { maxAge: 86400000 }, 'path =/')
                res.cookie('profilepic', resultdata[0].profilepic, { maxAge: 86400000 }, 'path =/')
                res.cookie('email', resultdata[0].email, { maxAge: 86400000 }, 'path =/')
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
    let sqldata = `SELECT email,password FROM userInfo WHERE email = '${req.body.email}'`;
    let resultdata = await queryDB(sqldata);

    if (resultdata == "") {
        res.end("false");
        console.log("Updated password fail");
    } else {
        let sql = `UPDATE ${tablename} SET password = '${req.body.password}' WHERE email = '${req.body.email}'`;
        let result = await queryDB(sql);
        res.end("true");
        console.log("Updated password successfully");
    }

})

app.get("/logout", (req, res) => {
    res.clearCookie('username');
    res.clearCookie('email');
    res.clearCookie('profilepic');
    return res.redirect('index.html');
})

app.post('/profilepic', (req, res) => {
    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('avatar');

    upload(req, res, (err) => {

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        } else if (!req.file) {
            return res.send('Please select an image to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }

        console.log('You uploaded this image filename: ' + req.file.filename);
        updateImg(req.cookies.email, req.file.filename);
        res.cookie("profilepic", req.file.filename);
        return res.redirect('home.html')
    });
})

const updateImg = async(email, filename) => {
    let sql = `UPDATE ${tablename} SET profilepic = '${filename}' WHERE email = '${email}'`;
    let result = await queryDB(sql);
    console.log("Updated profilepic successfully");
    //console.log(result);
}

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