let API = "http://localhost:3000/Users";

const $ = document.querySelector.bind(document);
var fullname = $("#full-name");
var password = $("#password");
var password_confirmation = $("#comfirm-password");
var email = $("#your-email");
var errors = {
    fullname: $(".error-fullname"),
    email: $(".error-email"),
    password: $(".error-password"),
    password_confirmation: $('.error-password-confirmation')
}
var users;
document.addEventListener("DOMContentLoaded", () => {
    fetch(API, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            users = data;
        })
        .catch((err) => {
            console.error(err);
        });
});
$(".form-detail").addEventListener("submit", function (e) {
    e.preventDefault();
    let countinue = true
    if (password.value.length >= 6) {
        errors.password.innerText = ""

        if (password.value != password_confirmation.value) {
            countinue= false
            errors.password_confirmation.innerText = "Mật khẩu xác nhận không chính xác!"
        } else {
            errors.password_confirmation.innerText = ""

        }
    } else {
        countinue= false

        errors.password.innerText = "Mật khẩu tối thiểu 6 kí tự!"
    }
    for (let u of users) {
        if (u.email == email.value) {
            errors.email.innerText = "Email đã tồn tại!"
            countinue = false
            break
        } else {
            errors.email.innerText = ""

        }
    }

    if (countinue == true) {
        fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id:users[users.length-1].id+1,
                fullname: fullname.value,
                email: email.value,
                password: password.value,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                window.location="http://127.0.0.1:5500/login.html"
            })
            .catch((err) => {
                console.error(err);
            });
    }

});
