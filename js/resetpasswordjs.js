window.onload = pageload;

function pageload() {
    document.cookie = "username=;"
    document.cookie = "profilepic=;"
    document.cookie = "email=;"
    var but = document.getElementById("applybut");
    but.onclick = applyresetpass;
    console.log(document.getElementById("resetform").elements.length);
}

function applyresetpass() {
    var regpass = document.forms["resetform"]["password"].value;
    var retrypass = document.forms["resetform"]["con_password"].value;
    var form = document.getElementById("resetform");

    for (var i = 0; i < form.elements.length; i++) {

        console.log(form.elements[i].value);
        if (form.elements[i].hasAttribute('required')) {
            if (form.elements[i].value == "") {
                alert("Fill out all requied!");
                return false;
            } else if (i == form.elements.length - 1) {
                if (regpass == retrypass) {
                    confirmresetpass();
                } else {
                    alert("Password not match!");
                    document.forms["resetform"]["password"].value = "";
                    document.forms["resetform"]["con_password"].value = "";
                    return false;
                }
            }
        }
    }
}

const confirmresetpass = (async() => {
    await fetch("/resetPassword", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: document.forms["resetform"]["email"].value,
            password: document.forms["resetform"]["password"].value
        })
    }).then((response) => {
        response.json().then((data) => {
            // console.log(response);
            // console.log(data);
            if (data == true) {
                alert("Reset Password Success.");
                document.getElementById("resetform").submit();
            } else {
                alert("Not found any Email in database");
            }
        });
    }).catch((err) => {
        console.log(err);
    });
})