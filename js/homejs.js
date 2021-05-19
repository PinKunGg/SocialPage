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
            //console.log(response);
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
            //console.log(data);
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

async function postfeed(data) {
    console.log(data);
    var postkeys = Object.keys(data);
    //console.log(postkeys.length);
    var feedcontainer = document.getElementById("feedcontainer");

    while (feedcontainer.firstChild) {
        feedcontainer.removeChild(feedcontainer.lastChild);
    }

    for (var i = postkeys.length - 1; i >= 0; i--) {
        var allpostbox = document.createElement("div");
        var gridallpost = document.createElement("div");
        var poster = document.createElement("div");
        var posterbg = document.createElement("div");
        var posterbox = document.createElement("div");
        var posterimg = document.createElement("img");

        var postername = document.createElement("div");
        var username = document.createElement("span");

        var posttime = document.createElement("div");
        var postdate = document.createElement("small");

        var contentall = document.createElement("div");
        var contentbox = document.createElement("div");
        var content = document.createElement("p");

        var likebutdiv = document.createElement("div");
        var likeimg = document.createElement("img");
        var likebut = document.createElement("button");

        var newline = document.createElement("br");

        allpostbox.className = "allpost-box";
        gridallpost.className = "grid-container-allpost";
        poster.id = "poster";
        posterbg.className = "poster-bgbox";
        posterbox.className = "poster-box";

        await getPosterImg(posterimg, data[postkeys[i]].posterid);

        allpostbox.appendChild(gridallpost);
        gridallpost.appendChild(poster);
        poster.appendChild(posterbg);
        posterbg.appendChild(posterbox);
        posterbox.appendChild(posterimg);

        await getPosterUser(username, data[postkeys[i]].posterid)

        postername.className = "poster-name";
        poster.appendChild(postername);
        postername.appendChild(username);

        postdate.innerHTML = data[postkeys[i]].post_date;
        posttime.className = "post-time";
        poster.appendChild(posttime);
        posttime.appendChild(postdate);

        content.innerHTML = data[postkeys[i]].post;
        contentall.id = "content";
        contentbox.className = "content-box";
        gridallpost.appendChild(contentall);
        contentall.appendChild(contentbox);
        contentbox.appendChild(content);

        likeimg.src = "pic/heart-01.png";
        likebut.className = "like-but";
        likebut.innerHTML = data[postkeys[i]].like_count;
        likebutdiv.className = "likebut-div";

        var like_uid = data[i].like_user;
        var like_sid = like_uid.split(", ");
        //console.log(like_sid);

        for (var j = 0; j < like_sid.length; j++) {

            if (like_sid[j] == getCookie('user_id')) {
                likeimg.src = "pic/heart-02.png";
                likebutdiv.setAttribute("onclick", "");
            } else {
                likebutdiv.setAttribute("onclick", "likepost(this)");
            }
        }

        contentall.appendChild(likebutdiv);
        likebutdiv.appendChild(likeimg);
        likebutdiv.appendChild(likebut);

        allpostbox.id = data[postkeys[i]].id;

        feedcontainer.appendChild(allpostbox);
        feedcontainer.appendChild(newline);
    }
}

const getPosterImg = (async(obj, posterid) => {
    await fetch("/getposterimg", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            posterid: posterid,
        })
    }).then((response) => {
        response.json().then((data) => {
            obj.src = 'img/' + data;
        });
    }).catch((err) => {
        console.log("ERROR = " + err);
    });
})

const getPosterUser = (async(obj, posterid) => {
    await fetch("/getposteruser", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            posterid: posterid,
        })
    }).then((response) => {
        response.json().then((data) => {
            obj.innerHTML = data;
        });
    }).catch((err) => {
        console.log("ERROR = " + err);
    });
})

function likepost(post_id) {
    console.log(post_id.lastChild.innerHTML);
    post_id.firstChild.src = "pic/heart-02.png";
    post_id.setAttribute("disabled", "true");
    post_id.setAttribute("onclick", "");
    console.log("like_click! = " + post_id.parentNode.parentNode.parentNode.id);
    sendlikepost(post_id);
}

const sendlikepost = (async(post_id) => {
    await fetch("/likepost", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            postid: post_id.parentNode.parentNode.parentNode.id,
        })
    }).then((response) => {
        console.log(response);
        response.json().then((data) => {
            post_id.lastChild.innerHTML = JSON.parse(data);
            console.log(data);
        });
    }).catch((err) => {
        console.log("ERROR = " + err);
    });
})

function posterror(errlist) {
    console.log(errlist);

    var feedcontainer = document.getElementById("feedcontainer");
    while (feedcontainer.firstChild) {
        feedcontainer.removeChild(feedcontainer.lastChild);
    }

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