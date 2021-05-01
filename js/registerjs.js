window.onload = pageload;

function pageload() {
    var resigform = document.getElementById("registerform");
    resigform.onsubmit = submitregister;
}

function submitregister() {
    var regpass = document.forms["registerform"]["password"].value;
    var retrypass = document.forms["registerform"]["con_password"].value;

    if (regpass == retrypass) {
        confirmregister();
        alert("Register Success.");
    } else {
        alert("Password not match!");
        document.forms["registerform"]["password"].value = "";
        document.forms["registerform"]["con_password"].value = "";
        return false;
    }
}

const confirmregister = (async() => {
    fetch("/registerform", {
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
        response.json().then(() => {
            console.log("register success");
        });
    }).catch((err) => {
        console.log(err);
    });
})