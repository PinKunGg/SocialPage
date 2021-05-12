window.onload = pageload;

function pageload() {
    document.cookie = "username=;"
    var but = document.getElementById("loginbut");
    but.onclick = sendsubmitlogin;
}

const sendsubmitlogin = (async() => {
    await fetch("/loginform", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: document.forms["loginform"]["email"].value,
            password: document.forms["loginform"]["password"].value,
        })
    }).then((response) => {
        //console.log(response);
        response.json().then((data) => {
            console.log(data);
            if (data == true) {
                console.log("true!!");
                alert("Login success");
                document.getElementById("loginform").submit();
            } else if (data == false) {
                console.log("false!!");
                alert("Email or Password not correct");
            } else {
                console.log("null!!");
                alert("Not found any Email in database");
            }
        });
    }).catch((err) => {
        console.log(err);
    });
})