const user="david"
const pass="181996"

function esperar(ms){
    adminMsg("Esperar "+ms+" milisegundos")
    return new Promise(resolve => setTimeout(resolve, ms))
}

function backIndex() {
    window.location.href="index.html"
}

async function login() {
    const inputUser=document.getElementById("user").value
    const inputPass=document.getElementById("pass").value

    const msg=document.getElementById("msg")
    const loading=document.getElementById("loading")

    const isUser=inputUser===user
    const isPass=inputPass===pass

    if (isUser&&isPass) {
        loading.classList.add("active")
        await esperar(3000)
        window.location.href="panel.html"
    } else {
        msg.classList.add("act")
    }
}

document.getElementById("pass").addEventListener("keydown", function(e) {
    if (e.key==="Enter") {
        login()
    }
})