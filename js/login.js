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

    const error=document.getElementById("msg")
    const loading=document.getElementById("loading")

    const isUser=inputUser===user
    const isPass=inputPass===pass

    if (isUser&&isPass) {
        error.classList.remove("act")
        loading.classList.add("active")
        await esperar(3000)
        window.location.href="panel.html"
    } else {
        error.classList.add("act")
        if (isUser) {
            error.textContent="*Contraseña incorrecta"
        } else if (isPass) {
            error.textContent="*Usuario incorrecto"
        } else {
            error.textContent="*Datos incorrectos"
        }
    }
}

document.getElementById("pass").addEventListener("keydown", function(e) {
    if (e.key==="Enter") {
        login()
    }
})