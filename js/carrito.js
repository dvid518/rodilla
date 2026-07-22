import {db} from "./firebase.js"

import {collection, addDoc, serverTimestamp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"

(function () {
    const CLAVE_CARRITO="rodilla_carrito"
    let carrito=obtenerCarritoGuardado()

    function obtenerCarritoGuardado() {
        try {
            const carritoGuardado=localStorage.getItem(CLAVE_CARRITO)
            return carritoGuardado?JSON.parse(carritoGuardado):[]
        } catch (error) {
            console.error("No se pudo leer el carrito:", error)
            return []
        }
    }

    function guardarCarrito() {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
        actualizarCarrito()
    }

    function formatearPrecio(precio) {
        return Number(precio || 0).toFixed(2)
    }

    function escaparHTML(texto = "") {
        return String(texto)
            .replaceAll("&", "&amp")
            .replaceAll("<", "&lt")
            .replaceAll(">", "&gt")
            .replaceAll('"', "&quot")
            .replaceAll("'", "&#039")
    }

    function crearCarritoHTML() {
        if (document.getElementById("carrito-panel")) {
            return
        }
        const botonCarrito = document.createElement("button")
        botonCarrito.type = "button"
        botonCarrito.id = "abrir-carrito"
        botonCarrito.className = "boton-carrito"
        botonCarrito.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 3H5L7.2 14.5C7.4 15.4 8.2 16 9.1 16H17.8C18.7 16 19.5 15.4 19.7 14.5L21 7H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <circlecx="9"cy="20"r="1.5"fill="currentColor"/>
                <circle cx="18" cy="20" r="1.5" fill="currentColor"/>
            </svg>
            <span class="cantidad-carrito" id="cantidad-carrito">
                0
            </span>
        `
        const navbar=document.querySelector(".right")

        if (navbar) {
            const menuMovil =
                navbar.querySelector(".menu-toggle")
            const botonReserva =
                navbar.querySelector(".btn")
            if (botonReserva) {
                navbar.insertBefore(
                    botonCarrito,
                    botonReserva
                )
            } else if (menuMovil) {
                navbar.insertBefore(
                    botonCarrito,
                    menuMovil
                )
            } else {
                navbar.appendChild(botonCarrito)
            }
        }
        const overlay = document.createElement("div")
        overlay.id = "carrito-overlay"
        overlay.className = "carrito-overlay"

        const panel = document.createElement("aside")

        panel.id = "carrito-panel"
        panel.className = "carrito-panel"

        panel.innerHTML = `
            <div class="carrito-header">

                <div>
                    <h2>Carrito</h2>
                    <p>
                        Productos seleccionados
                    </p>
                </div>

                <button
                    type="button"
                    id="cerrar-carrito"
                    class="cerrar-carrito"
                    aria-label="Cerrar carrito"
                >
                    ×
                </button>

            </div>

            <div
                id="lista-carrito"
                class="lista-carrito"
            ></div>

            <div class="carrito-footer">
                <div class="total-carrito">
                    <span>Total:</span>
                    <strong id="total-carrito">
                        S/ 0.00
                    </strong>
                </div>
                <button type="button" id="seguir-comprando" class="seguir-comprando">
                    Seguir comprando
                </button>
                <button type="button" id="vaciar-carrito" class="vaciar-carrito">
                    Vaciar carrito
                </button>
                <button type="button" id="realizar-pedido" class="realizar-pedido">
                    Realizar pedido
                </button>

            </div>
        `

        document.body.appendChild(overlay)
        document.body.appendChild(panel)

        configurarEventosCarrito()
    }

    function agregarProducto(producto) {

        if (!producto || !producto.nombre) {

            console.error(
                "El producto no tiene los datos necesarios."
            )

            return
        }

        const idProducto = String(
            producto.id ||
            producto.nombre
                .trim()
                .toLowerCase()
                .replaceAll(" ", "-")
        )

        const productoExistente = carrito.find(
            item => String(item.id) === idProducto
        )

        if (productoExistente) {

            productoExistente.cantidad += 1

        } else {

            carrito.push({
                id: idProducto,
                nombre: producto.nombre,
                precio: Number(producto.precio || 0),
                img: producto.img || "",
                categoria: producto.categoria || "",
                cantidad: 1
            })
        }

        guardarCarrito()
        abrirCarrito()
    }

    function cambiarCantidad(id, cambio) {

        const producto = carrito.find(
            item => String(item.id) === String(id)
        )

        if (!producto) {
            return
        }

        producto.cantidad += cambio

        if (producto.cantidad <= 0) {

            eliminarProducto(id)

            return
        }

        guardarCarrito()
    }

    function eliminarProducto(id) {

        carrito = carrito.filter(
            item => String(item.id) !== String(id)
        )

        guardarCarrito()
    }

    function vaciarCarrito() {

        if (carrito.length === 0) {
            return
        }

        const confirmar = window.confirm(
            "¿Deseas eliminar todos los productos del carrito?"
        )

        if (!confirmar) {
            return
        }

        carrito = []

        guardarCarrito()
    }

    function obtenerTotal() {

        return carrito.reduce(
            (total, producto) => {

                return total + (
                    Number(producto.precio) *
                    Number(producto.cantidad)
                )

            },
            0
        )
    }

    function obtenerCantidadTotal() {
        return carrito.reduce((total, producto) => {return total+Number(producto.cantidad)},0)
    }

    function crearProductoCarrito(producto) {

        const subtotal =
            Number(producto.precio) *
            Number(producto.cantidad)

        return `
            <article class="carrito-item">

                <img src="${escaparHTML(producto.img)}" alt="${escaparHTML(producto.nombre)}">
                <div class="carrito-item-info">
                    <h4>
                        ${escaparHTML(producto.nombre)}
                    </h4>
                    <p>
                        S/ ${formatearPrecio(producto.precio)}
                        por unidad
                    </p>
                    <div class="control-cantidad">
                        <button
                            type="button"
                            class="btn-cantidad"
                            data-accion="restar"
                            data-id="${escaparHTML(producto.id)}"
                        >
                            −
                        </button>

                        <span>
                            ${producto.cantidad}
                        </span>

                        <button
                            type="button"
                            class="btn-cantidad"
                            data-accion="sumar"
                            data-id="${escaparHTML(producto.id)}"
                        >
                            +
                        </button>

                    </div>

                </div>

                <div class="carrito-item-final">

                    <strong>
                        S/ ${formatearPrecio(subtotal)}
                    </strong>

                    <button
                        type="button"
                        class="btn-eliminar-producto"
                        data-id="${escaparHTML(producto.id)}"
                    >
                        Eliminar
                    </button>

                </div>

            </article>
        `
    }

    function actualizarCarrito() {

        const lista=document.getElementById("lista-carrito")
        const cantidad=document.getElementById("cantidad-carrito")
        const total=document.getElementById("total-carrito")
        const botonVaciar=document.getElementById("vaciar-carrito")
        const botonPedido=document.getElementById("realizar-pedido")

        if (cantidad) {
            cantidad.textContent =
                obtenerCantidadTotal()
        }
        if (total) {

            total.textContent =
                `S/ ${formatearPrecio(obtenerTotal())}`
        }
        if (!lista) {
            return
        }
        if (carrito.length === 0) {
            lista.innerHTML = `
                <div class="carrito-vacio">
                    <div class="carrito-vacio-icono">
                        🛒
                    </div>
                    <h3>
                        Tu carrito está vacío
                    </h3>
                    <p>
                        Visita el menú y agrega los productos
                        que deseas pedir.
                    </p>
                    <a
                        href="menu.html"
                        class="ir-menu-carrito"
                    >
                        Ver el menú
                    </a>
                </div>
            `

            if (botonVaciar) {
                botonVaciar.disabled = true
            }

            if (botonPedido) {
                botonPedido.disabled = true
            }
            return
        }


        lista.innerHTML = carrito
            .map(crearProductoCarrito)
            .join("")


        if (botonVaciar) {
            botonVaciar.disabled = false
        }

        if (botonPedido) {
            botonPedido.disabled = false
        }
    }

    function abrirCarrito() {

        const panel=document.getElementById("carrito-panel")
        const overlay=document.getElementById("carrito-overlay")

        if (panel) {
            panel.classList.add("abierto")
        }

        if (overlay) {
            overlay.classList.add("visible")
        }

        document.body.classList.add("sin-scroll")
    }

    function cerrarCarrito() {
        const panel=document.getElementById("carrito-panel")

        const overlay=document.getElementById("carrito-overlay")

        if (panel) {
            panel.classList.remove("abierto")
        }

        if (overlay) {
            overlay.classList.remove("visible")
        }

        document.body.classList.remove("sin-scroll")
    }

    async function realizarPedido(){
        if(carrito.length===0){
            return
        }
        const nombre=prompt("Ingrese su nombre:")
        if(nombre===null || !nombre.trim()){
            return
        }
        const telefono=prompt("Ingrese su teléfono:")
        if(telefono===null || !telefono.trim()){
            return
        }
        try{
            await addDoc(
                collection(db,"pedidos"),
                {
                    nombre:nombre.trim(),
                    telefono:telefono.trim(),
                    total:obtenerTotal(),
                    estado:"Pendiente",
                    creado:serverTimestamp(),
                    productos:carrito.map(producto => ({
                        nombre:producto.nombre,
                        cantidad:producto.cantidad,
                        precio:producto.precio,
                        subtotal:
                            Number(producto.precio) *
                            Number(producto.cantidad)
                    }))
                }
            )
            alert("Pedido realizado correctamente.")
            carrito=[]
            guardarCarrito()
            cerrarCarrito()
            window.location.href="menu.html"
        } catch(error) {
            console.error("Error al guardar pedido:", error)
            alert("No se pudo registrar el pedido.")
        }
    }

    function configurarEventosCarrito() {

        document
            .getElementById("abrir-carrito")
            ?.addEventListener(
                "click",
                abrirCarrito
            )

        document
            .getElementById("cerrar-carrito")
            ?.addEventListener(
                "click",
                cerrarCarrito
            )

        document
            .getElementById("carrito-overlay")
            ?.addEventListener(
                "click",
                cerrarCarrito
            )

        document
            .getElementById("seguir-comprando")
            ?.addEventListener(
                "click",
                cerrarCarrito
            )

        document
            .getElementById("vaciar-carrito")
            ?.addEventListener(
                "click",
                vaciarCarrito
            )

        document
            .getElementById("realizar-pedido")
            ?.addEventListener(
                "click",
                realizarPedido
            )


        document.addEventListener(
            "click",
            function (evento) {

                const botonCantidad =
                    evento.target.closest(
                        ".btn-cantidad"
                    )

                const botonEliminar =
                    evento.target.closest(
                        ".btn-eliminar-producto"
                    )


                if (botonCantidad) {

                    const accion =
                        botonCantidad.dataset.accion

                    const cambio =
                        accion === "sumar"
                            ? 1
                            : -1

                    cambiarCantidad(
                        botonCantidad.dataset.id,
                        cambio
                    )
                }

                if (botonEliminar) {

                    eliminarProducto(
                        botonEliminar.dataset.id
                    )
                }
            }
        )


        document.addEventListener(
            "keydown",
            function (evento) {
                if (evento.key === "Escape") {
                    cerrarCarrito()
                }
            }
        )

        window.addEventListener("storage",
            function (evento) {
                if (evento.key === CLAVE_CARRITO) {
                    carrito=obtenerCarritoGuardado()
                    actualizarCarrito()
                }
            }
        )
    }

    function iniciarCarrito() {
        crearCarritoHTML()
        actualizarCarrito()
    }

    window.CarritoRodilla = {
        agregarProducto,
        abrirCarrito,
        cerrarCarrito,
        actualizarCarrito,
        obtenerProductos: function () {
            return [...carrito]
        }
    }


    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarCarrito
        )
    } else {
        iniciarCarrito()
    }
})()