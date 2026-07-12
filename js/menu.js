import {db} from "./firebase.js";

import {collection,getDocs} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"

function crearCard(producto, categoria) {
    const productoCodificado=encodeURIComponent(JSON.stringify(producto))

    return `
        <div class="card-producto ${categoria} glass">
            <img src="${producto.img}" alt="${producto.nombre}">
            <h4>${producto.nombre}</h4>
            <p class="precio">
                S/ ${Number(producto.precio).toFixed(2)}
            </p>
            <button class="btn-agregar" data-producto="${productoCodificado}">
                Agregar al carrito
            </button>
        </div>
    `
}

function renderProductos(lista, containerId) {
    const container=document.getElementById(containerId)
    container.innerHTML=""
    lista.forEach(producto => {container.innerHTML+=crearCard(producto, containerId)})
}

async function cargarColeccion(nombreColeccion) {
    const snapshot=await getDocs(collection(db, nombreColeccion))
    return snapshot.docs.map(doc => ({
        id:doc.id,
        categoria:nombreColeccion,
        ...doc.data()
    }));
}

function configurarBotonesAgregar() {
    document.addEventListener("click",evento=>{
        const boton=evento.target.closest(".btn-agregar")

        if(!boton)return

        const producto=JSON.parse(decodeURIComponent(boton.dataset.producto))

        window.CarritoRodilla.agregarProducto(producto)

        const texto=boton.textContent

        boton.textContent="Agregado"
        boton.disabled=true

        setTimeout(()=>{
            boton.textContent=texto
            boton.disabled=false
        },700)
    })
}

async function iniciarMenu() {
    configurarBotonesAgregar()

    const bebidas=await cargarColeccion("bebidas")
    const postres=await cargarColeccion("postres")
    const aperitivos=await cargarColeccion("aperitivos")

    renderProductos(bebidas, "bebidas")
    renderProductos(postres, "postres")
    renderProductos(aperitivos, "aperitivos")
}

iniciarMenu();