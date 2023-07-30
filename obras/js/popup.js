function mostrarPopUp(imagen) {
    const popup = document.querySelector('.popup');
    const imagenPopup = document.getElementById('imagen-popup');

    // Obtener la URL de la imagen clickeada y establecerla en el pop-up
    const imagenURL = imagen.src;
    imagenPopup.src = imagenURL;

    // Mostrar el pop-up
    popup.style.display = 'flex';
}

function cerrarPopUp() {
    const popup = document.querySelector('.popup');

    // Cerrar el pop-up
    popup.style.display = 'none';
}

function toggleZoom() {
    const imagenPopup = document.getElementById('imagen-popup');
    imagenPopup.classList.toggle('zoomed');
}

// Agregar evento de clic a la imagen del pop-up para activar/desactivar el zoom
document.getElementById('imagen-popup').addEventListener('click', toggleZoom);