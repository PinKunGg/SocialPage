window.onload = pageload;

function pageload() {
    document.cookie = "username=;"
    document.cookie = "profilepic=;"
    document.cookie = "email=;"
    document.cookie = "user_id=;"
    var but = document.getElementById("registerbut");
    but.onclick = submitregister;
    console.log(document.getElementById("registerform").elements.length);
}

function submitregister() {
    var regpass = document.forms["registerform"]["password"].value;
    var retrypass = document.forms["registerform"]["con_password"].value;
    var form = document.getElementById("registerform");

    for (var i = 0; i < form.elements.length; i++) {

        //console.log(form.elements[i].value);
        if (form.elements[i].hasAttribute('required')) {
            if (form.elements[i].value == "") {
                alert("Fill out all requied!");
                return false;
            } else if (document.forms["registerform"]["gender"].value == "") {
                console.log(document.forms["registerform"]["gender"].value);
                alert("Fill out all requied!");
                return false;
            }
        } else if (i == form.elements.length - 1 && document.forms["registerform"]["gender"].value != "") {
            if (regpass == retrypass) {
                confirmregister();
            } else {
                alert("Password not match!");
                document.forms["registerform"]["password"].value = "";
                document.forms["registerform"]["con_password"].value = "";
                return false;
            }
        }
    }
}

const confirmregister = (async() => {
    await fetch("/registerform", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: document.forms["registerform"]["email"].value,
            password: document.forms["registerform"]["password"].value,
            firstname: document.forms["registerform"]["firstname"].value,
            lastname: document.forms["registerform"]["lastname"].value,
            gender: document.forms["registerform"]["gender"].value,
            birthday: document.forms["registerform"]["bday"].value,
            profilepic: "user.png"
        })
    }).then((response) => {
        response.json().then((data) => {
            // console.log(response);
            // console.log(data);
            if (data == true) {
                alert("Register Success.");
                document.getElementById("registerform").submit();
            } else if (data == "same_eamil") {
                alert("Register Fail. Same email detect");
                document.forms["registerform"]["email"].value = null;
            } else {
                alert("Register Fail.");
            }
        });
    }).catch((err) => {
        console.log(err);
    });
})