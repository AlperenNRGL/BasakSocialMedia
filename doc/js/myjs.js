const element = document.getElementById("searchfriend");

document.getElementById("searchfriend").addEventListener("keyup", (e) => {
    console.log(e.target.value);
    fetch("http://localhost:3000/users/" + e.target.value)
        .then(value => value.json())
        .then(data => showUser(data))
        .catch(err => console.log(err))
})

function showUser(data) {
    const element = document.getElementById("users-list")
    element.innerHTML = "";
    data.forEach(user => {
        element.insertAdjacentHTML("afterbegin",`<a href="/user/${user._id}" class="d-flex justify-content-around bg-light align-items-center" style="width:300px ; height : 70px">
            <img src="/static/uploads/${user.profilImage}" width="42px" height="42px" class="text-left rounded-circle">
            <span class="text-bold">${user.username}</span>
        </a>`)
    });
}