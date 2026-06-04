// control de pasos
let pasoActual=0;
let personas=null;
let nombre="";
let email="";
let fecha="";
let hora="";

const pasos=[
    "paso-personas",
    "paso-fecha",
    "paso-hora",
    "paso-datos",
    "paso-confirmacion"
];

function showPaso(index) {
    pasos.forEach((id, i)=>{
        const seccion=document.getElementById(id);
        if (!seccion) return;
        seccion.classList.remove("activo");
        if (i===index) {
            seccion.classList.add("activo");
        }
    });
    updateFases(index);
}

function updateFases(index) {
    const fases=document.querySelectorAll(".fase");
    fases.forEach((fase, i) => {
        fase.classList.remove("act");
        if (i===index) {
            fase.classList.add("act");
        }
    });
}

function nextPaso() {
    if (pasoActual<pasos.length-1) {
        pasoActual++;
        if (pasoActual===4) {
            fillResumen();
        }
        showPaso(pasoActual);
    }
}

// validaciones
function validateDato(pasoActual) {
    switch (pasoActual) {
        case 0:
            if (!personas||personas.trim()==="") {
                alert("Selecciona o ingresa personas")
                return false
            }
            break
        case 1:
            if (!fecha) {
                alert("Selecciona una fecha")
                return false
            }
            break
        case 2:
            if (!hora) {
                alert("Selecciona una hora")
                return false
            }
            break
        case 3:
            if (!nombre||nombre.trim()==="") {
                alert("Ingresa nombre")
                return false
            }
            if (!emai||email.trim()==="") {
                alert("Ingresa email")
                return false
            }
            break
    }
    return true
}

// botón continuar
document.querySelectorAll(".continuar").forEach(btn => {
    btn.addEventListener("click", () => {
        const nombreValor=document.getElementById("nombre").value
        const emailValor=document.getElementById("email").value
        const fechaValor=document.getElementById("fecha").value
        const horaValor=document.getElementById("hora").value
        if (validateDato(pasoActual)) {
            nombre=nombreValor
            email=emailValor
            fecha=fechaValor
            hora=horaValor
        } else {
            return;
        }
        if (!personas && inputPersonas.value.trim() !== "") {
            personas=inputPersonas.value
        }
        nextPaso()
    });
});

// guardar pasos
document.querySelectorAll(".personas button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".personas button").forEach(b => {
            b.classList.remove("active");
        });
        const inputPersonas=document.querySelector(".personas input");
        inputPersonas.classList.remove("active");
        inputPersonas.value="";
        btn.classList.add("active");
        personas=btn.textContent;
    });
});

// input manual
const inputPersonas=document.querySelector(".personas input");
inputPersonas.addEventListener("input", (e) => {
    document.querySelectorAll(".personas button").forEach(b => {
        b.classList.remove("active");
    });
    if (e.target.value.trim() !== "") {
        inputPersonas.classList.add("active");
        personas=e.target.value;
    } else {
        inputPersonas.classList.remove("active");
        personas=null;
    }
});

// fecha
document.getElementById("fecha").addEventListener("change", (e) => {fecha=e.target.value});

// hora
document.getElementById("hora").addEventListener("change", (e) => {hora=e.target.value});

// datos usuario
document.getElementById("nombre").addEventListener("change", (e) => {nombre=e.target.value});

document.getElementById("email").addEventListener("change", (e) => {email=e.target.value});

// llenar resumen
function fillResumen() {
    document.getElementById("res-nombre").textContent=nombre;
    document.getElementById("res-email").textContent=email;
    document.getElementById("res-fecha").textContent=fecha;
    document.getElementById("res-hora").textContent=hora;
    document.getElementById("res-personas").textContent=personas;
}

// main
document.addEventListener("DOMContentLoaded", () => {
    showPaso(0);
});

// onclick
function confirmReserva() {
    alert("Pronto podrás agendar reservas.")
}

function editReserva() {
    alert("Pronto podrás editar las reservas.")
}