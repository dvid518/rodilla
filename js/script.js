const menu=document.getElementById("menu")

const items=["index-i", "menu-i", "nosotros-i", "contacto-i", "reserva-i"]

// funciones de diseño
const fondos={light:["light1", "light2"], dark:["dark1", "dark2"]}

function getRandomBg(theme) {
    const lista=fondos[theme]
    adminMsg("Se obtuvo fondo aleatorio")
    return lista[Math.floor(Math.random()*lista.length)]
}

async function randomBackground() {
    const body=document.body
    const home=body.classList.contains("home")
    const login=body.classList.contains("login")
    const panel=body.classList.contains("panel")

    if (home||login||panel) {
        adminMsg("No se eligió fondo en página principal.")
        return
    }

    const theme=body.classList.contains("dark")?"dark":"light"
    adminMsg("Identificado tema de la página: "+theme)

    const bg=getRandomBg(theme)
    if (bg==="dark2") {
        body.style.backgroundColor="#1e3932"
    } else {
        body.style.backgroundColor="#360e06"
    }

    const url=`img/avif/${bg}.avif`
    body.style.backgroundImage=`url('${url}')`
    adminMsg("Se aplicó el fondo aleatorio: "+bg)
}

document.addEventListener("DOMContentLoaded", () => {
    adminMsg("Procede la selección del fondo aleatorio")
    randomBackground()
})

// funciones de apoyo
function esperar(ms){
    adminMsg("Esperar "+ms+" milisegundos")
    return new Promise(resolve => setTimeout(resolve, ms))
}

function adminMsg(msg) {
    console.log("ADMIN: "+msg)
}

function adminErr(msg) {
    console.error("ERROR: "+msg)
}

// funciones de menu
async function showMenu() {
    adminMsg("Muestra menú móvil")
    menu.classList.add("active")

    for (let i=0; i<items.length; i++) {
        await esperar(75)
        adminMsg("Muestra item "+i)
        let item=document.getElementById(items[i])
        item.classList.add("act")
    }
}

async function hideMenu() {
    for (let i=items.length-1; i>=0; i--) {
        await esperar(75)
        adminMsg("Oculta item "+i)
        let item=document.getElementById(items[i])
        item.classList.remove("act")
    }
    menu.classList.remove("active")
    adminMsg("Oculta menú móvil")
}