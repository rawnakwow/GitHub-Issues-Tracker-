const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if (
        username === "admin" &&
        password === "admin123"
    ) {

        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "index.html";

    } else {

        alert("Invalid Credentials");

    }

});