let API = "http://localhost:3000/Users";
const $ = document.querySelector.bind(document)
var email = $("#email")
var password = $("#password")
var errors = {
    email:$(".error-email"),
    password:$(".error-password")
}
$("form").addEventListener("submit",function(e){
    e.preventDefault()
    fetch(`${API}?email=${email.value}&password=${password.value}`,{
        method:"GET",
        headers:{   
            "Content-Type":"application/json"
        }
    }).then((response)=>response.json())
    .then((data)=>{
        if(data.length==0){
            errors.email.innerText = "Email hoặc mật khẩu không chính xác!"
        }else{
            window.localStorage.setItem("user",JSON.stringify(data[0]))
            window.location= "http://127.0.0.1:5500/"
        }
    }).catch((err)=>{

        console.error(err);
    })
})