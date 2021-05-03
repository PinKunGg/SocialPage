window.onload = pageload;

function pageload() {
    readAllPost();
    var postbut = document.getElementById("submitpost");
    postbut.onclick = submitpost;
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
                username: document.getElementById("username").value,
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
            if (data == "Not found and post") {
                posterror(data);
            } else {
                postfeed(data);
            }

        }).catch((err) => {
            posterror(err);
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

    for (var i = postkeys.length - 1; i > -1; i--) {
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

function posterror(data) {
    var post = document.createElement("div");
    var content = document.createElement("p");
    var username = document.createElement("h3");
    var endcontent = document.createElement("hr");

    content.innerHTML = data;
    username.innerHTML = "System";

    post.appendChild(username);
    post.appendChild(content);
    post.appendChild(endcontent);
    feedcontainer.appendChild(post);
}