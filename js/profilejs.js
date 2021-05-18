function checkCookie() {
    var username = "";
    if (getCookie("username") == false) {
        window.location = "index.html";
    }
}

checkCookie();
window.onload = pageload;

function getCookie(name) {
    var value = "";
    try {
        value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
        return value
    } catch (err) {
        return false
    }
}

function pageload() {
    getprofileInfo();
    showImg('img/' + getCookie('profilepic'));

    document.getElementById('uploadAvatar').onclick = fileUpload;
    document.getElementById('fileField').onchange = fileSubmit;
}

function showImg(filename) {
    //console.log(filename);
    var http = new XMLHttpRequest();
    http.open('HEAD', filename, false);
    http.send();
    if (http.status != 404) {
        if (filename !== "") {
            var showpic = document.getElementById('displayPic');
            showpic.innerHTML = "";
            var temp = document.createElement("img");
            temp.src = filename;
            showpic.appendChild(temp);
        }
    } else {
        if (filename !== "") {
            var showpic = document.getElementById('displayPic');
            showpic.innerHTML = "";
            var temp = document.createElement("img");
            temp.src = 'img/user.png';
            showpic.appendChild(temp);
        }
    }
}

function fileUpload() {
    document.getElementById('fileField').click();
    console.log("1");
}

function fileSubmit() {
    document.getElementById('formId').submit();
    console.log("2");
}

const getprofileInfo = (async() => {
    await fetch("/getprofile").then((response) => {
        response.json().then((data) => {
            console.log(data);
            document.getElementsByName("firstname").value = data[0].firstname;
            document.getElementsByName("lastname").value = data[0].lastname;

            var x = document.getElementsByName("gender");

            for (var i = 0; i < x.length; i++) {
                if (data[0].gender == "male") {
                    x[0].checked = true;
                    break;
                } else if (data[0].gender == "female") {
                    x[1].checked = true;
                    break;
                } else {
                    x[2].checked = true;
                    break;
                }
            }

            document.getElementsByName("bday").value = data[0].birthday
            document.getElementsByName("email").value = data[0].email
            document.getElementsByName("password").value = data[0].password

        }).catch((err) => {
            console.log(err);
        })
    })
})