let carrito = [];
let total = 0;
let currentSlide = 0;

// Inicializa EmailJS con tu Public Key
emailjs.init("Q7Ko5Zf8oW-be7ClS");

// Función para agregar productos al carrito
function agregarAlCarrito(producto, precio) {
    carrito.push({ producto, precio });
    total += precio;
    actualizarCarrito();
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    listaCarrito.innerHTML = ""; // Limpiar contenido previo

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
    } else {
        const lista = document.createElement("ul");
        carrito.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `${item.producto} - S/${item.precio.toFixed(2)} 
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>`;
            lista.appendChild(listItem);
        });
        listaCarrito.appendChild(lista);
    }

    // Actualizar total
    document.getElementById("total-precio").textContent = total.toFixed(2);
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(indice) {
    total -= carrito[indice].precio; // Restar el precio del producto eliminado
    carrito.splice(indice, 1); // Quitar producto del carrito
    actualizarCarrito();
}

// Función para mostrar el carrito y ocultar los productos
function mostrarCarrito() {
    document.querySelector(".compra-grid").style.display = "none"; // Ocultar productos
    document.getElementById("carrito").style.display = "block"; // Mostrar carrito
    document.getElementById("ver-carrito").style.display = "none"; // Ocultar botón "Ver Carrito"
}

// Función para volver a la vista de productos
function mostrarProductos() {
    document.querySelector(".compra-grid").style.display = "flex"; // Mostrar productos
    document.getElementById("carrito").style.display = "none"; // Ocultar carrito
    document.getElementById("ver-carrito").style.display = "inline-block"; // Mostrar botón "Ver Carrito"
}

// Función para finalizar la compra y mostrar el formulario dinámico
function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Por favor, añade productos.");
        return;
    }

    // Oculta el carrito y muestra el formulario de compra
    document.getElementById("carrito").style.display = "none";
    document.getElementById("formulario-compra").style.display = "block";
}

// Función para mostrar el formulario dinámico según el tipo de cliente
function mostrarFormulario() {
    const tipoCliente = document.getElementById("tipo-cliente").value;

    // Oculta ambos formularios por defecto
    document.getElementById("formulario-persona").style.display = "none";
    document.getElementById("formulario-empresa").style.display = "none";

    // Muestra el formulario correspondiente al tipo de cliente
    if (tipoCliente === "persona") {
        document.getElementById("formulario-persona").style.display = "block";
    } else if (tipoCliente === "empresa") {
        document.getElementById("formulario-empresa").style.display = "block";
    }
}

// Función para procesar la compra según el tipo de cliente y el método de pago
function procesarCompra() {
    const tipoCliente = document.getElementById("tipo-cliente").value;
    const metodoPago = document.getElementById("metodo-pago").value;

    if (!metodoPago) {
        alert("Por favor, seleccione un método de pago.");
        return;
    }

    let templateParams = {
        productos: carrito.map(item => `${item.producto} - S/${item.precio.toFixed(2)}`).join(", "),
        total: total.toFixed(2),
        formaPago: metodoPago,
    };

    if (tipoCliente === "persona") {
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const direccion = document.getElementById("direccion").value;

        if (!nombre || !correo || !direccion) {
            alert("Por favor, complete toda la información.");
            return;
        }

        templateParams.nombre = nombre;
        templateParams.correo = correo;
        templateParams.direccion = direccion;

    } else if (tipoCliente === "empresa") {
        const nombreEmpresa = document.getElementById("nombre-empresa").value;
        const ruc = document.getElementById("ruc").value;
        const correoEmpresa = document.getElementById("correo-empresa").value;
        const direccionEmpresa = document.getElementById("direccion-empresa").value;

        if (!nombreEmpresa || !ruc || !correoEmpresa || !direccionEmpresa) {
            alert("Por favor, complete toda la información.");
            return;
        }

        templateParams.nombre = nombreEmpresa;
        templateParams.correo = correoEmpresa;
        templateParams.direccion = direccionEmpresa;
    }

    //alert(templateParams);

    // Enviar el correo usando EmailJS
    emailjs.send("OceanRevive", "template_4x8cl3j", templateParams)
        .then(response => {
            alert("Compra confirmada. Correo enviado con éxito." );
        })
        .catch(error => {
            alert("Error al enviar el correo de confirmación.");
            console.error(error);
        });

    // Reinicia el carrito
    carrito = [];
    total = 0;
    actualizarCarrito();

    // Oculta el formulario y vuelve a mostrar los productos
    document.getElementById("formulario-compra").style.display = "none";
    document.querySelector(".compra-grid").style.display = "flex";
}

// Función para el control automático del carrusel
function showSlides() {
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;

    slides.forEach(slide => slide.style.display = "none"); // Oculta todas las diapositivas
    slides[currentSlide].style.display = "block"; // Muestra la diapositiva actual

    currentSlide = (currentSlide + 1) % totalSlides; // Avanza al siguiente índice
}

// Configuración inicial del carrusel
document.addEventListener("DOMContentLoaded", () => {
    showSlides(); // Muestra la primera diapositiva
    setInterval(showSlides, 3000); // Cambia automáticamente cada 3 segundos
});
