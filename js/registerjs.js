window.onload = pageload;

function pageload() {
    document.cookie = "username=;"
    var but = document.getElementById("registerbut");
    but.onclick = submitregister;
}

function submitregister() {
    var regpass = document.forms["registerform"]["password"].value;
    var retrypass = document.forms["registerform"]["con_password"].value;

    if (regpass == retrypass) {
        confirmregister();
    } else if (regpass != retrypass) {
        alert("Password not match!");
        document.forms["registerform"]["password"].value = "";
        document.forms["registerform"]["con_password"].value = "";
        return false;
    } else {
        alert("Fill out all requied!");
        return false;
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
            birthday: document.forms["registerform"]["bday"].value
        })
    }).then((response) => {
        response.json().then((data) => {
            // console.log(response);
            // console.log(data);
            if (data == true) {
                alert("Register Success.");
                document.getElementById("registerform").submit();
            } else {
                alert("Register Fail.");
            }
        });
    }).catch((err) => {
        console.log(err);
    });
})