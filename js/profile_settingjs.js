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

    document.getElementById("submitUpdateProfile").onclick = getUpdateProfile;
    //getUpdateProfile();
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
            document.getElementById("firstname").value = data[0].firstname;
            document.getElementById("lastname").value = data[0].lastname;

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

            document.getElementById("bday").value = data[0].birthday
            document.getElementById("email").value = data[0].email
            document.getElementById("password").value = data[0].password
            document.getElementById("status").value = data[0].status

        }).catch((err) => {
            console.log(err);
        })
    })
})

function getUpdateProfile() {

    var form = document.getElementById("updateform");

    for (var i = 0; i < form.elements.length; i++) {

        //console.log(form.elements[i].value);
        if (form.elements[i].hasAttribute('required')) {
            if (form.elements[i].value == "") {
                alert("Fill out all requied!");
                return false;
            } else if (document.forms["updateform"]["gender"].value == "") {
                console.log(document.forms["updateform"]["gender"].value);
                alert("Fill out all requied!");
                return false;
            }
        } else if (i == form.elements.length - 1) {

            var x = document.getElementsByName("gender");
            var y;

            for (var i = 0; i < x.length; i++) {
                if (x[i].checked) {
                    y = x[i].value;
                    break;
                }
            }

            updateprofile(y);
            break;
        }
    }
}

const updateprofile = (async(updatedValue) => {
    console.log(updatedValue);
    await fetch("/updateprofile", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            gender: updatedValue,
            birthday: document.getElementById("bday").value,
            status: document.getElementById("status").value,
        })
    }).then((response) => {
        response.json().then((data) => {
            alert(data);
        });
    }).catch((err) => {
        alert(err);
    });
})