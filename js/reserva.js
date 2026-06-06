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

const pasos=["paso-personas", "paso-fecha", "paso-hora", "paso-datos", "paso-confirmacion"]

document.addEventListener("DOMContentLoaded", () => {
    inputPersonas = document.querySelector(".personas input")
    inputFecha = document.getElementById("fecha")
    inputHora = document.getElementById("hora")
    inputNombre = document.getElementById("nombre")
    inputEmail = document.getElementById("email")

    showPaso(0);
});

function showPaso(index) {
    pasoActual = index
    adminMsg("Muestra paso " + index)
    pasos.forEach((id, i) => {
        const seccion = document.getElementById(id)
        if (!seccion) return

        seccion.classList.toggle("activo", i === index)
    })
    updateFases(index)
}

function updateFases(index) {
    document.querySelectorAll(".fase").forEach((fase, i) => {
        fase.classList.toggle("act", i === index)
    })
}

function nextPaso() {
    if (pasoActual<pasos.length-1) {
        pasoActual++
        if (pasoActual===4) {
            fillResumen()
        }
        adminMsg("Siguiente paso ("+pasoActual+")")
        showPaso(pasoActual)
    }
}

// validaciones
function validateDato(pasoActual) {
    switch (pasoActual) {
        case 0:
            if (!personas||personas.toString().trim()==="") {
                alert("Selecciona o ingresa personas")
                adminErr("Falló validación en paso "+pasoActual)
                return false
            }
            if (Number(personas)>10) {
                alert("El número máximo de personas por reservación es 10")
                adminErr("Falló validación en paso "+pasoActual)
                return false
            }
            break
        case 1:
            if (!inputFecha.value) {
                alert("Selecciona una fecha")
                return false
            }
            fecha=inputFecha.value
            break
        case 2:
            if (!inputHora.value) {
                alert("Selecciona una hora")
                return false
            }
            hora=inputHora.value
            break
        case 3:
            if (!inputNombre.value.trim()) {
                alert("Ingresa nombre")
                return false
            }
            if (!inputEmail.value.trim()) {
                alert("Ingresa email")
                return false
            }
            nombre=inputNombre.value
            email=inputEmail.value
            break
        }
    return true
}

// botón continuar
function handleContinuar() {
    console.log("Click continuar");
    if (!validateDato(pasoActual)) return
    adminMsg("Paso "+pasoActual+" validado correctamente")
    nextPaso()
}

document.addEventListener("keydown", (e) => {
    if (e.key==="Enter") {
        const tag=e.target.tagName.toLowerCase()
        if (tag==="input"||tag==="select") {
            e.preventDefault()
        }
    }
})

// guardar pasos
document.querySelectorAll(".personas button").forEach(btn => {
    btn.addEventListener("click", () => {
        adminMsg("Click en botón .continuar2")
        document.querySelectorAll(".personas button").forEach(b => {
            b.classList.remove("active")
        })
        const inputPersonas=document.querySelector(".personas input")
        inputPersonas.classList.remove("active")
        inputPersonas.value=""
        btn.classList.add("active")
        personas=btn.textContent
    })
})

// input personas
if (inputPersonas) {
    inputPersonas.addEventListener("input", (e) => {
        document.querySelectorAll(".personas button").forEach(b => {
            b.classList.remove("active")
        })
        const val=e.target.value.trim()
        if (val) {
            inputPersonas.classList.add("active")
            personas=val
        } else {
            inputPersonas.classList.remove("active")
            personas=null
        }
    })
}

// datos usuario
document.getElementById("fecha").addEventListener("input", (e) => {fecha=e.target.value})
document.getElementById("hora").addEventListener("input", (e) => {hora=e.target.value})
document.getElementById("nombre").addEventListener("input", (e) => {nombre=e.target.value})
document.getElementById("email").addEventListener("input", (e) => {email=e.target.value})

// llenar resumen
function fillResumen() {
    document.getElementById("res-nombre").textContent=nombre
    document.getElementById("res-email").textContent=email
    document.getElementById("res-fecha").textContent=fecha
    document.getElementById("res-hora").textContent=hora
    document.getElementById("res-personas").textContent=personas
    adminMsg("Resumen llenado correctamente")
    adminMsg(nombre+" "+email+" "+fecha+" "+hora)
}

// onclick
function confirmReserva() {
    alert("Reserva confirmada correctamente.")
    window.location.href="index.html"
    adminMsg("Reserva agendada")
}

function editReserva() {
    pasoActual=0;
    showPaso(pasoActual);
    adminMsg("Reincio de proceso de reserva")
}