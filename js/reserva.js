import {db} from "./firebase.js"

import {collection, addDoc, serverTimestamp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"

// control de pasos
let pasoActual=0;

let personas=null;
let nombre="";
let email="";
let fecha="";
let hora="";

let inputPersonas;
let inputFecha;
let inputHora;
let inputNombre;
let inputEmail;

const pasos=[
    "paso-personas",
    "paso-fecha",
    "paso-hora",
    "paso-datos",
    "paso-confirmacion"
]

document.addEventListener("DOMContentLoaded", () => {
    inputPersonas=document.querySelector(".personas input")
    inputFecha=document.getElementById("fecha")
    inputHora=document.getElementById("hora")
    inputNombre=document.getElementById("nombre")
    inputEmail=document.getElementById("email")

    // botones cantidad personas
    document.querySelectorAll(".personas button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".personas button")
            .forEach(b => b.classList.remove("active"))
            inputPersonas.classList.remove("active")
            inputPersonas.value=""
            btn.classList.add("active")
            personas=btn.textContent
        })
    })

    // input personalizado personas
    inputPersonas.addEventListener("input", e => {
        document.querySelectorAll(".personas button").forEach(b => b.classList.remove("active"))
        const valor=e.target.value.trim()
        if(valor) {
            inputPersonas.classList.add("active")
            personas=valor
        } else {
            inputPersonas.classList.remove("active")
            personas=null
        }

    })
    inputFecha.addEventListener("input", e=>{fecha=e.target.value})
    inputHora.addEventListener("input", e=>{hora=e.target.value})
    inputNombre.addEventListener("input", e=>{nombre=e.target.value})
    inputEmail.addEventListener("input", e=>{email=e.target.value})
    showPaso(0)
})

// mostrar pasos
function showPaso(index) {
    pasoActual=index
    pasos.forEach((id,i)=>{
        const seccion=document.getElementById(id)
        if (seccion) {
            seccion.classList.toggle("activo", i===index)
        }
    })
    updateFases(index)
}

// barra progreso
function updateFases(index) {
    document.querySelectorAll(".fase").forEach((fase,i)=>{fase.classList.toggle("act", i===index)})
}

// siguiente paso
function nextPaso() {
    if(pasoActual < pasos.length-1){
        pasoActual++
        if(pasoActual===4){
            fillResumen()
        }
        showPaso(pasoActual)
    }
}

// validaciones
function validateDato(pasoActual) {
    switch(pasoActual){
        case 0:
            if (!personas) {
                alert("Selecciona la cantidad de personas")
                return false
            }
            if (Number(personas)>10) {
                alert("Máximo 10 personas")
                return false
            }
        break;
        case 1:
            if (!inputFecha.value) {
                alert("Selecciona una fecha")
                return false
            }
            fecha=inputFecha.value
        break;
        case 2:
            if (!inputHora.value) {
                alert("Selecciona una hora")
                return false
            }
            hora=inputHora.value
        break;
        case 3:
            if (!inputNombre.value.trim()) {
                alert("Ingrese su nombre")
                return false
            }
            if (!inputEmail.checkValidity()) {
                alert("Ingrese un correo válido")
                return false
            }
            nombre=inputNombre.value
            email=inputEmail.value
        break;
    }
    return true

}

// botones continuar
document.querySelectorAll("[name='continuar']")
.forEach(btn=>{
    btn.addEventListener(
        "click",
        handleContinuar
    )
})

function handleContinuar() {
    if(!validateDato(pasoActual))
        return
    nextPaso()
}

// llenar resumen
function fillResumen() {
    document.getElementById("res-nombre").textContent=nombre
    document.getElementById("res-email").textContent=email
    document.getElementById("res-fecha").textContent=fecha
    document.getElementById("res-hora").textContent=hora
    document.getElementById("res-personas").textContent=personas
}

// GUARDAR EN FIRESTORE
async function confirmReserva() {
    try{
        await addDoc(collection(db,"reservas"),{nombre:nombre, email:email, personas:Number(personas), fecha:fecha, hora:hora})
        alert("Reserva confirmada correctamente")
        window.location.href="index.html"
    } catch (error) {
        console.error("Error guardando reserva:", error)
        alert("No se pudo guardar la reserva")
    }
}

// editar reserva
function editReserva() {
    showPaso(3)
}

// hacer funciones accesibles al HTML
window.confirmReserva=confirmReserva
window.editReserva=editReserva