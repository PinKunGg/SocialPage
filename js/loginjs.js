window.onload = pageload;

function pageload() {
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
            } else {
                console.log("false!!");
                alert("Email or Password not correct");
            }
        });
    }).catch((err) => {
        console.log(err);
    });
})