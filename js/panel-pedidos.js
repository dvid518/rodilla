import {db} from "./firebase.js"
import {collection, getDocs, doc, getDoc, deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"

function crearFila(pedido) {
    return `
        <tr>
            <td>${pedido.id}</td>
            <td>${pedido.nombre}</td>
            <td>${pedido.telefono}</td>
            <td>S/ ${Number(pedido.total).toFixed(2)}</td>
            <td>${pedido.estado}</td>
            <td class="icon">
                <button class="btn-view" data-id="${pedido.id}">
                    Ver más
                </button>
            </td>
            <td class="icon trash">
                <button class="btn-delete" data-id="${pedido.id}">
                    <svg class="trash" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"/>
                    </svg>
                </button>
            </td>
        </tr>
    `
}

function renderTabla(lista) {
    const tbody = document.getElementById("pedidos-tbody")

    tbody.innerHTML=lista.map(pedido => crearFila(pedido)).join("")

    tbody.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", () => {
            deletePedido(btn.dataset.id)
        })
    })

    tbody.querySelectorAll(".btn-view").forEach(btn=>{
        btn.addEventListener("click",()=>{
            verPedido(btn.dataset.id)
        })
    })
}

async function loadPedidos() {
    const snapshot = await getDocs(
        collection(db, "pedidos")
    )
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

async function iniciarPanel() {
    try {
        const pedidos = await loadPedidos()
        renderTabla(pedidos)
    } catch (error) {
        console.error(
            "Error al cargar pedidos:",
            error
        )
    }
}

// modal eliminar
const deleteModal = document.getElementById("deleteModal")
const modalConfirm = document.getElementById("modalConfirm")
const modalCancel = document.getElementById("modalCancel")
const modalClose = document.getElementById("modalClose")

const pedidoNombre = document.getElementById("productName")
const pedidoDetalle = document.getElementById("productCategory")

const detailModal=document.getElementById("detailModal")
const detailClose=document.getElementById("detailClose")
const btnCerrarDetalle=document.getElementById("btnCerrarDetalle")
const btnCompletar=document.getElementById("btnCompletar")

const dNombre=document.getElementById("dNombre")
const dTelefono=document.getElementById("dTelefono")
const dTotal=document.getElementById("dTotal")
const dProductos=document.getElementById("dProductos")

let pedidoActual=null

let pendingDelete = null

async function deletePedido(id) {
    try {
        const pedidoRef = doc(db, "pedidos", id)
        const snapshot = await getDoc(pedidoRef)
        const pedido = snapshot.data()

        pedidoNombre.textContent = pedido.nombre
        pedidoDetalle.textContent = `S/ ${Number(pedido.total).toFixed(2)}`

        pendingDelete = id

        showModal()

    } catch (error) {
        console.error(
            "Error al cargar pedido:",
            error
        )
    }
}

function showModal() {
    deleteModal.classList.remove("fade-out")
    deleteModal.classList.add("active")
    document.body.style.overflow = "hidden"
}

function closeModal() {

    deleteModal.classList.add("fade-out")

    setTimeout(() => {
        deleteModal.classList.remove(
            "active",
            "fade-out"
        )

        document.body.style.overflow = ""
        pendingDelete = null

    }, 300)
}

async function executeDelete(id) {

    try {

        await deleteDoc(
            doc(db, "pedidos", id)
        )

        closeModal()
        iniciarPanel()

    } catch (error) {

        console.error(
            "Error al eliminar pedido:",
            error
        )

        alert("Error al eliminar el pedido")
    }
}

modalConfirm.addEventListener("click", () => {
    if (pendingDelete) {
        executeDelete(pendingDelete)
    }

})

modalCancel.addEventListener("click", closeModal)

modalClose.addEventListener("click", closeModal)

document.addEventListener("keydown", e => {

    if (e.key === "Escape" && deleteModal.classList.contains("active")) {closeModal()}

})

deleteModal.addEventListener("click", e => {if (e.target === deleteModal) {closeModal()}})

async function verPedido(id){
    const snapshot=await getDoc(doc(db,"pedidos",id))
    const pedido=snapshot.data()

    pedidoActual=id

    dNombre.textContent=pedido.nombre
    dTelefono.textContent=pedido.telefono
    dTotal.textContent=pedido.total

    dProductos.innerHTML=pedido.productos.map(producto=>`
        <div class="producto-item">
            <strong>${producto.nombre}</strong>
            <span>
                ${producto.cantidad} ×
                S/ ${Number(producto.precio).toFixed(2)}
            </span>
        </div>
    `).join("")

    btnCompletar.style.display=pedido.estado==="Pendiente"?"block":"none"
    detailModal.classList.add("active")
}

btnCompletar.addEventListener("click",async()=>{
    await updateDoc(doc(db,"pedidos",pedidoActual),{estado:"Completado"})
    detailModal.classList.remove("active")
    iniciarPanel()
})

detailClose.addEventListener("click",()=>{
    detailModal.classList.remove("active")
})

btnCerrarDetalle.addEventListener("click",()=>{
    detailModal.classList.remove("active")
})

iniciarPanel()