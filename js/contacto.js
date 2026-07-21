import {db} from "./firebase.js"

import {collection, addDoc, serverTimestamp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"

// control de datos
let nombre=""
let email=""
let mensaje=""

let inputNombre;
let inputEmail;
let inputMensaje;
let checkbox;
let formulario;

document.addEventListener("DOMContentLoaded",()=>{
    inputNombre=document.getElementById("nombre")
    inputEmail=document.getElementById("mail")
    inputMensaje=document.getElementById("mensaje")
    checkbox=document.getElementById("checkbox")
    formulario=document.querySelector("form")

    inputNombre.addEventListener("input",e=>{nombre=e.target.value})
    inputEmail.addEventListener("input",e=>{email=e.target.value})
    inputMensaje.addEventListener("input",e=>{mensaje=e.target.value})

    formulario.addEventListener("submit",enviarMensaje)

})

// validaciones
function validateMensaje(){
    if(!inputNombre.value.trim()){
        alert("Ingrese su nombre")
        return false
    }
    if(!inputEmail.checkValidity()){
        alert("Ingrese un correo válido")
        return false
    }
    if(!inputMensaje.value.trim()){
        alert("Ingrese un mensaje")
        return false
    }
    if(!checkbox.checked){
        alert("Debe aceptar el tratamiento de información")
        return false
    }
    return true
}

// guardar mensaje
async function enviarMensaje(e) {
    e.preventDefault()
    if(!validateMensaje())
        return
    try{
        await addDoc(collection(db,"mensajes"),{nombre:nombre, email:email, mensaje:mensaje})
        alert("Mensaje enviado correctamente")
        formulario.reset()
    } catch(error) {
        console.error("Error guardando mensaje:",error)
        alert("No se pudo enviar el mensaje")
    }
}