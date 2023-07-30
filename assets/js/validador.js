document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#myForm');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      // Validador del campo Nombre Completo
      const nombreInput = form.querySelector('#nombre');
      if (nombreInput.value.trim() === '') {
        alert('Por favor, ingresa tu nombre completo.');
        return;
      }
  
      // Validador del campo Email
      const emailInput = form.querySelector('#email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        alert('Por favor, ingresa un email válido.');
        return;
      }
  
      // Validador del campo Artista Favorito
      const artistaInput = form.querySelector('#artista');
      if (artistaInput.value.trim() === '') {
        alert('Por favor, ingresa tu artista favorito.');
        return;
      }
  
      // Si todos los campos son válidos, puedes enviar el formulario 
      alert('Formulario enviado exitosamente.');
    });
  });

  
  