const menu=document.getElementById("menu")

const items=["index-i", "menu-i", "nosotros-i", "contacto-i", "reserva-i"]

// funciones de apoyo
function esperar(ms){
    adminMsg("Esperar "+ms+" milisegundos")
    return new Promise(resolve => setTimeout(resolve, ms))
}

function adminMsg(msg) {
    console.log("ADMIN: "+msg)
}

function adminErr(msg) {
    console.log("ERROR: "+msg)
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
    adminMsg("Oculta menú móvil")
    for (let i=items.length-1; i>=0; i--) {
        await esperar(75)
        adminMsg("Oculta item "+i)
        let item=document.getElementById(items[i])
        item.classList.remove("act")
    }
    menu.classList.remove("active")
}

// funciones de diseño
const fondos={light:["light1", "light2"], dark:["dark1", "dark2"]}

function preloadBg() {
    Object.values(fondos).flat().forEach(name => {
        const img=new Image()
        img.src = `img/avif/${name}.avif`
    })
}

function getRandomBg(theme) {
    const lista=fondos[theme]
    return lista[Math.floor(Math.random()*lista.length)]
}

async function randomBackground() {
    const body=document.body
    if (body.classList.contains("home")) return
    const theme=body.classList.contains("dark")?"dark":"light"
    const bg=getRandomBg(theme)
    if (bg==="dark2") {
        body.style.backgroundColor="#1e3932"
    }
    const url=`img/avif/${bg}.avif`
    await new Promise((resolve, reject) => {
        const img=new Image()
        img.src=url
        img.onload=resolve
        img.onerror=reject
    })
    body.style.backgroundImage=`url('${url}')`
}

document.addEventListener("DOMContentLoaded", () => {
    preloadBg()
    randomBackground()
})