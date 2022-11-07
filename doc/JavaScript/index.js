//! İndex

// Yeni konuşma baslatma
const userid = document.getElementById("userid").value
document.getElementById("newmessage").addEventListener("keyup", (e) => {
    let options = {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: e.target.value
        }),
    }
    fetch(`http://localhost:3000/getnewmessageusers/${userid}`, options)
        .then(data => data.json())
        .then(result => {
            let start = "<div class='tipue_drop_box'>"
            let end = "</div>"
            let middle = ""
            result.forEach(user => {
                middle += `
                     <div class="tipue_drop_item" onclick="startnewmessage(this)" userid="${userid}" fromid="${user._id}">
                     <div class="tipue_drop_left"><img
                             src="/static/uploads/${user.profilImage}"
                             class="tipue_drop_image"></div>
                     <div class="tipue_drop_right">${user.firstName} ${user.lastName}<div><small>${user.username}</small></div>
                     </div>
                     </div>`
            });
            document.getElementById("deneme").innerHTML = ""
            document.getElementById("deneme").insertAdjacentHTML("beforeend", middle);


        })
        .catch(err => console.log(err))

})

// Yeni konusma baslatma fonksiyonu.
function startnewmessage(element) {
    const userid = element.getAttribute("userid");
    const fromid = element.getAttribute("fromid");

    fetch(`http://localhost:3000/newmessage/${userid}/${fromid}`)
        .then(data => {
            console.log("Mesaj Başlatıldı");
            window.location.reload();
            console.log(document.getElementById("denme"))


        })
        .catch(err => console.log(err))
}


//! Chat


function sendmessage() {
    const element = document.querySelector(".conversations-list");
    const messageid = element.querySelector(".is-active").attributes["data-chat-user"].nodeValue
    const userid = document.getElementById("userid").value;
    const text = document.getElementById("message-input").value
    const data = document.querySelector(".conversations-list").querySelector(".is-active").attributes
    data["message_count"].nodeValue++
    const date = new Date()
    const options = {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: text
        }),
    }
    fetch(`http://localhost:3000/sendmessage/${messageid}/${userid}`, options)
        .then(data => {
            document.getElementById(`${messageid}-conversation`).insertAdjacentHTML("beforeend", `
            <div class="chat-message is-sent">
                    <img src="/static/uploads/<%= user.profilImage %>"
                        data-demo-src="assets/img/avatars/dan.jpg" alt="">
                    <div class="message-block">
                        <span>
                            ${date}
                        </span>
                        <div class="message-text">
                            ${text}
                        </div>
                    </div>
                </div>`)
        })
        .catch(err => console.log(err))

}

let messagecount = ""
setInterval(() => {
    const data = document.querySelector(".conversations-list").querySelector(".is-active").attributes
    const messageid = data["data-chat-user"].nodeValue;
    messagecount = data["message_count"].nodeValue;
    // console.log(messageid,messagecount);

    fetch(`http://localhost:3000/getmessage/${messageid}`)
        .then(data => data.json())
        .then(res => {
            if (messagecount != res.__v) {
                data["message_count"].nodeValue = res.__v;
                const newmessage = res.text.slice(messagecount, res.__v)
                newmessage.forEach(message => {
                    document.getElementById(`${messageid}-conversation`).insertAdjacentHTML("beforeend", `
                <div class="chat-message is-received">
                        <img src="/static/uploads/${message.user.profilImage}"
                            data-demo-src="assets/img/avatars/dan.jpg" alt="">
                        <div class="message-block">
                            <span>
                                ${message.date}
                            </span>
                            <div class="message-text">
                               ${message.text}
                            </div>
                        </div>
                    </div>`)
                });

            }
        })
        .catch(err => console.error(err))

}, 5000)


document.querySelector(".panel-body").classList.remove("is-hidden");


//! Navbar

const element = document.getElementById("tipue_drop_content");

document.getElementById("tipue_drop_input").addEventListener("keyup", (e) => {
    if (e.target.value == "") {
        element.style.display = "none";
        return;
    }
    fetch("http://localhost:3000/users/" + e.target.value)
        .then(value => value.json())
        .then(data => showUser(data))
        .catch(err => console.log(err))
})

function showUser(data) {
    let middle = ""
    data.forEach(user => {
        middle += ` <a href="/user/${user._id}">
                <div class="tipue_drop_item">
                    <div class="tipue_drop_left"><img
                            src="/static/uploads/${user.profilImage}"
                            class="tipue_drop_image"></div>
                    <div class="tipue_drop_right">${user.firstName} ${user.lastName}<div><small>${user.username}</small></div>
                    </div>
                </div>
            </a>`})
    element.style.display = "block";
    element.innerHTML = ""
    element.innerHTML = ('<div class="tipue_drop_box">' + middle + '</div>')

};




//! Nofication

document.getElementById("nofication-btn").addEventListener("click", (e) => {
    const userid = document.getElementById("userid")
    fetch(`http://localhost:3000/get-nofication/${userid.value}`)
        .then(data => data.json())
        .then(data => {

            const nofication_list = document.getElementById("nofication-list")
            nofication_list.innerHTML = ""
            data.forEach(nofication => {
                nofication_list.insertAdjacentHTML("afterbegin", `<div class="media">
                        <figure class="media-left">
                            <p class="image">
                                <img src="/static/uploads/${nofication.bildirimiyapan.profilImage}" 
                                data-demo-src="assets/img/avatars/david.jpg" alt="">
                            </p>
                        </figure>
                        <div class="media-content">
                            <span>${nofication.worktype}</span>
                            <span class="time">${nofication.date}</span>
                        </div>
                        <div class="media-right">
                            <div class="added-icon">
                                <i data-feather="message-square"></i>
                            </div>
                        </div>
                    </div>`)
            });

        })
        .catch(err => console.log(err))
})



//! Post

function add_comment(e) {
    const userid = document.getElementById("userid").value;
    const touserid = e.previousElementSibling.previousElementSibling.value
    const postid = e.previousElementSibling.value;
    const text = e.parentNode.parentNode.parentNode.children[0].children[0].children[0].value
    fetch(`http://localhost:3000/add-comment/${postid}/${userid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
    })
        .then(data => {
            document.getElementById(`post-${postid}`).insertAdjacentHTML("beforeend", `
                     <div class="media is-comment">
                         <!-- User image -->
                         <div class="media-left">
                             <div class="image">
                                 <img src="/static/uploads/<%= user.profilImage %>"
                                     data-demo-src="assets/img/avatars/dan.jpg" data-user-popover="1" alt="">
                             </div>
                         </div>
                         <!-- Content -->
                         <div class="media-content">
                             <a href="#">
                                 <%= user.username %>
                             </a>
                             <span class="time">Şimdi</span>
                             <p>
                                ${text}
                             </p>
                         </div>
                     </div>
        `)
        })
        .catch(err => console.log(err))

    add_nofication("comment", userid, touserid);

}

function add_alt_comment(e) {
    const userid = document.getElementById("userid").value;
    const postid = e.previousElementSibling.value;
    const commentid = e.previousElementSibling.previousElementSibling.value;
    const text = e.parentNode.parentNode.parentNode.children[0].children[0].children[0].value
    e.parentNode.parentNode.parentNode.parentNode.parentNode.insertAdjacentHTML("beforeBegin", `
        <div class="media is-comment">
            <!-- User image -->
            <div class="media-left">
                <div class="image">
                    <img src="/static/uploads/<%= user.profilImage %>"
                        data-demo-src="assets/img/avatars/david.jpg" data-user-popover="4" alt="">
                </div>
            </div>
            <!-- Content -->
            <div class="media-content">
                <a href="#">
                    <%= user.username %>
                </a>
                <span class="time">
                    Şimdi
                </span>
                <p>
                    ${text}
                </p>
            
            </div>
            <!-- Right side dropdown -->
            <div class="media-right"></div>
        </div>`);
    fetch(`http://localhost:3000/add-alt-comment/${postid}/${userid}/${commentid}`, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
    })
        .then(data => data)
        .catch(err => console.log(err))
}


function add_nofication(work, myuser, touser) {


    console.log(work, myuser, touser);

    // fetch(`http://localhost:3000/add-nofication/${touserid}/${userid}`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ type : "comment" }),
    // })
    // .then(data => data.json())
    // .then(veri => console.log(veri))
    // .catch(err => console.log(err))


}


function like_btn(e) {
    const postid = e.previousElementSibling.value;
    const userid = document.getElementById("userid").value;
    const countlike = document.getElementById(postid);
    if (e.children[0].attributes.src.nodeValue == "/static/uploads/icons8-like-64.png") {
        fetch(`http://localhost:3000/remove-like/${postid}/${userid}`)
            .then(data => {
                countlike.innerHTML = (Number(countlike.innerHTML) - 1)

                e.children[0].remove();
                e.insertAdjacentHTML("afterbegin", `
            <img width="40px" height="40px" src="/static/uploads/icons8-like-64-2.png">
            `)
            })
            .catch(err => console.log(err))
        return;
    }
    fetch(`http://localhost:3000/add-like/${postid}/${userid}`)
        .then(data => {
            e.children[0].remove();
            e.insertAdjacentHTML("afterbegin", `
            <img width="40px" height="40px" src="/static/uploads/icons8-like-64.png">
            `)
            countlike.innerHTML = (Number(countlike.innerHTML) + 1)
        })
        .catch(err => console.log(err))
}



//! Profile
function like_btn(e){
    const postid = e.previousElementSibling.value;
    const userid = document.getElementById("userid").value;
    const countlike = document.getElementById(postid);
    if(e.children[0].attributes.src.nodeValue == "/static/uploads/icons8-like-64.png"){
        fetch(`http://localhost:3000/remove-like/${postid}/${userid}`)
        .then(data => {
        countlike.innerHTML = (Number(countlike.innerHTML) - 1)
        
        e.children[0].remove();
        e.insertAdjacentHTML("afterbegin",`
        <img width="40px" height="40px" src="/static/uploads/icons8-like-64-2.png">
        `)
        })
        .catch(err => console.log(err))
        return;
        }
    fetch(`http://localhost:3000/add-like/${postid}/${userid}`)
    .then(data => {
        add_nofication("like", userid, e.previousElementSibling.previousElementSibling.value )
        e.children[0].remove();
        e.insertAdjacentHTML("afterbegin",`
        <img width="40px" height="40px" src="/static/uploads/icons8-like-64.png">
        `)
    countlike.innerHTML = (Number(countlike.innerHTML) + 1)
    })
    .catch(err => console.log(err))
}