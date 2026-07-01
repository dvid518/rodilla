import {db} from "./firebase.js";

import {collection,getDocs} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"

function crearCard(producto, categoria) {
    return `
        <div class="card-producto ${categoria} glass">
            <img src="${producto.img}" alt="${producto.nombre}">
            <h4>${producto.nombre}</h4>
            <p class="precio">
                S/ ${producto.precio}.00
            </p>
        </div>
    `
}

function renderProductos(lista, containerId) {
    const container=document.getElementById(containerId)
    lista.forEach(producto => {container.innerHTML+=crearCard(producto, containerId)})
}

async function cargarColeccion(nombreColeccion) {
    const snapshot=await getDocs(collection(db, nombreColeccion))
    return snapshot.docs.map(doc => doc.data());
}

async function iniciarMenu() {
    const bebidas=await cargarColeccion("bebidas")
    const postres=await cargarColeccion("postres")
    const aperitivos=await cargarColeccion("aperitivos")
    renderProductos(bebidas, "bebidas")
    renderProductos(postres, "postres")
    renderProductos(aperitivos, "aperitivos")
}

iniciarMenu();