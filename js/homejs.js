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
    readAllPost();
    var postbut = document.getElementById("submitpost");
    postbut.onclick = submitpost;
    document.getElementById("username").innerHTML = getCookie('username');
    showImg('img/' + getCookie('profilepic'));

    document.getElementById('displayPic').onclick = fileUpload;
    document.getElementById('fileField').onchange = fileSubmit;
}

function showImg(filename) {
    console.log(filename);
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

const submitpost = (async() => {
    if (document.getElementById("postinput").value != "" && document.getElementById("username").value != "") {
        await fetch("/submitpost", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: document.getElementById("username").innerHTML,
                post: document.getElementById("postinput").value,
                likecount: "0",
            })
        }).then((response) => {
            console.log(response);
            response.json().then((data) => {
                document.getElementById("postinput").value = ""
                postfeed(data);
            });
        }).catch((err) => {
            console.log("ERROR = " + err);
        });
    } else {
        alert("Write something to post!")
    }
})

const readAllPost = (async() => {
    await fetch("/readallpost").then((response) => {
        response.json().then((data) => {
            console.log(data);
            if (data == "No post found") {
                posterror(0);
            } else {
                postfeed(data);
            }

        }).catch((err) => {
            posterror(err)
        })
    })
})

function postfeed(data) {
    console.log(data);
    var postkeys = Object.keys(data);
    console.log(postkeys.length);
    var feedcontainer = document.getElementById("feedcontainer");

    while (feedcontainer.firstChild) {
        feedcontainer.removeChild(feedcontainer.lastChild);
    }

    for (var i = postkeys.length - 1; i >= 0; i--) {
        var post = document.createElement("div");
        var content = document.createElement("p");
        var username = document.createElement("h3");
        var postdate = document.createElement("small");
        var likebutton = document.createElement("button");
        var likedata = document.createElement("span");
        var endcontent = document.createElement("hr");
        var newline = document.createElement("br");

        content.innerHTML = data[postkeys[i]].post;
        username.innerHTML = data[postkeys[i]].username;
        postdate.innerHTML = data[postkeys[i]].post_date;
        likedata.innerHTML = data[postkeys[i]].like_count;
        likedata.innerHTML += "&nbsp";
        likebutton.type = "button";
        likebutton.innerHTML = "like";
        post.appendChild(username);
        post.appendChild(content);
        post.appendChild(likedata);
        post.appendChild(likebutton);
        post.appendChild(newline);
        post.appendChild(postdate);
        post.appendChild(endcontent);
        //post.innerHTML = postkeys.length;
        //post.appendChild(feedcontainer);
        feedcontainer.appendChild(post);
        //feedcontainer.innerHTML = post.innerHTML;
    }
}

function posterror(errlist) {
    console.log(errlist);

    var post = document.createElement("div");
    var content = document.createElement("p");
    var username = document.createElement("h3");
    var endcontent = document.createElement("hr");

    if (errlist == 0) {
        content.innerHTML = "No post found ;(";
        username.innerHTML = "[System]";
    } else {
        content.innerHTML = errlist;
        username.innerHTML = "[System]";
    }

    post.appendChild(username);
    post.appendChild(content);
    post.appendChild(endcontent);
    feedcontainer.appendChild(post);
}