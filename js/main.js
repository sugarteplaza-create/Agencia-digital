/* ============================================================
   main.js — Lógica dinámica del sitio NexoWeb
   
   Este archivo contiene tres funcionalidades principales:
   1. Menú hamburguesa ( responsive para móviles )
   2. Galería filtrable del portafolio
   3. Validación y envío del formulario de contacto
   
   Todos los scripts se ejecutan después de que el DOM
   esté completamente cargado gracias a DOMContentLoaded.
============================================================ */


/* ============================================================
   ESPERAR QUE EL DOM ESTÉ LISTO
   'DOMContentLoaded' se dispara cuando el HTML fue parseado
   completamente, sin esperar imágenes ni CSS.
   Así evitamos errores de "elemento no encontrado".
============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     1. MENÚ HAMBURGUESA ( RESPONSIVE )
     En pantallas pequeñas, el menú se oculta y se muestra
     con un botón. Al hacer clic, alternamos la clase 'abierto'
     en el menú para que CSS lo muestre o lo esconda.
  ---------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    // Escucha el evento 'click' en el botón hamburguesa
    menuToggle.addEventListener('click', function () {
      // toggle() agrega la clase si no existe, la quita si ya existe
      navLinks.classList.toggle('abierto');
    });

    // Cierra el menú al hacer clic en cualquier enlace de navegación
    navLinks.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        navLinks.classList.remove('abierto');
      });
    });
  }


  /* ----------------------------------------------------------
     2. GALERÍA FILTRABLE — PORTAFOLIO
     
     Cómo funciona:
     - Cada tarjeta de proyecto tiene un atributo data-categoria
       (ej: data-categoria="web")
     - Al hacer clic en un botón de filtro, se llama a
       filtrarProyectos(categoria)
     - La función recorre todas las tarjetas y agrega o quita
       la clase 'oculto' según si la categoría coincide.
     - CSS oculta los elementos con clase 'oculto' (display:none).
  ---------------------------------------------------------- */

  // Hacemos la función global para que los onclick del HTML puedan llamarla
  window.filtrarProyectos = function (categoriaSeleccionada) {
    
    // Obtenemos todas las tarjetas de proyecto
    const tarjetas = document.querySelectorAll('.proyecto-card');
    
    // Obtenemos todos los botones de filtro
    const botonesFilto = document.querySelectorAll('.filtro-btn');

    // Actualizamos el estilo del botón activo
    botonesFilto.forEach(function (btn) {
      btn.classList.remove('activo'); // Quitamos 'activo' a todos
    });

    // Buscamos el botón que fue clickeado usando su atributo onclick
    // y le agregamos la clase 'activo'
    botonesFilto.forEach(function (btn) {
      // El atributo onclick contiene el nombre de la categoría
      if (btn.getAttribute('onclick').includes(categoriaSeleccionada)) {
        btn.classList.add('activo');
      }
    });

    // Recorremos cada tarjeta de proyecto
    tarjetas.forEach(function (tarjeta) {
      const categoríaTarjeta = tarjeta.getAttribute('data-categoria');

      if (categoriaSeleccionada === 'todos') {
        // Si se seleccionó 'todos', mostramos todas las tarjetas
        tarjeta.classList.remove('oculto');
      } else if (categoríaTarjeta === categoriaSeleccionada) {
        // Si la categoría coincide, mostramos la tarjeta
        tarjeta.classList.remove('oculto');
      } else {
        // Si no coincide, ocultamos la tarjeta
        tarjeta.classList.add('oculto');
      }
    });
  };


  /* ----------------------------------------------------------
     3. FORMULARIO DE CONTACTO CON VALIDACIÓN
     
     La validación del lado del cliente (front-end) mejora la
     experiencia de usuario. Verificamos:
     - Que los campos obligatorios no estén vacíos
     - Que el email tenga formato válido (usando expresión regular)
     - Que el mensaje tenga al menos 10 caracteres
     
     Si todo está bien, mostramos el modal de confirmación.
  ---------------------------------------------------------- */
  const formulario = document.getElementById('contactoForm');

  if (formulario) {
    // Escuchamos el evento 'submit' del formulario
    formulario.addEventListener('submit', function (evento) {
      
      // preventDefault() evita que la página se recargue (comportamiento
      // por defecto de los formularios HTML sin JS)
      evento.preventDefault();

      // Llamamos a la función de validación
      const esValido = validarFormulario();

      if (esValido) {
        // Si todos los campos son correctos, mostramos el modal
        mostrarModal();
        // Limpiamos el formulario después de "enviar"
        formulario.reset();
      }
    });
  }


  /* ----------------------------------------------------------
     FUNCIÓN: validarFormulario()
     Valida cada campo y muestra mensajes de error si corresponde.
     Retorna true si todo está bien, false si hay errores.
  ---------------------------------------------------------- */
  function validarFormulario () {
    let esValido = true; // Asumimos que es válido hasta que encontremos un error

    // --- Validar campo NOMBRE ---
    const campoNombre = document.getElementById('nombre');
    const errorNombre = document.getElementById('errorNombre');
    
    // trim() elimina espacios al inicio y al final del texto
    if (campoNombre.value.trim() === '') {
      mostrarError(campoNombre, errorNombre, 'El nombre es obligatorio.');
      esValido = false;
    } else if (campoNombre.value.trim().length < 3) {
      mostrarError(campoNombre, errorNombre, 'El nombre debe tener al menos 3 caracteres.');
      esValido = false;
    } else {
      limpiarError(campoNombre, errorNombre);
    }

    // --- Validar campo EMAIL ---
    const campoEmail = document.getElementById('email');
    const errorEmail = document.getElementById('errorEmail');
    
    // Expresión regular para validar formato de email
    // Comprueba que haya texto, luego @, luego texto, luego punto, luego texto
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (campoEmail.value.trim() === '') {
      mostrarError(campoEmail, errorEmail, 'El correo electrónico es obligatorio.');
      esValido = false;
    } else if (!regexEmail.test(campoEmail.value.trim())) {
      // test() retorna true si el email cumple el patrón
      mostrarError(campoEmail, errorEmail, 'Ingresa un correo electrónico válido.');
      esValido = false;
    } else {
      limpiarError(campoEmail, errorEmail);
    }

    // --- Validar campo MENSAJE ---
    const campoMensaje = document.getElementById('mensaje');
    const errorMensaje = document.getElementById('errorMensaje');
    
    if (campoMensaje.value.trim() === '') {
      mostrarError(campoMensaje, errorMensaje, 'El mensaje es obligatorio.');
      esValido = false;
    } else if (campoMensaje.value.trim().length < 10) {
      mostrarError(campoMensaje, errorMensaje, 'El mensaje debe tener al menos 10 caracteres.');
      esValido = false;
    } else {
      limpiarError(campoMensaje, errorMensaje);
    }

    return esValido;
  }


  /* ----------------------------------------------------------
     FUNCIÓN: mostrarError(campo, spanError, mensaje)
     Agrega clase 'error' al campo (CSS le pone borde rojo)
     y muestra el mensaje de error en el span correspondiente.
  ---------------------------------------------------------- */
  function mostrarError (campo, spanError, mensaje) {
    campo.classList.add('error');       // Borde rojo (definido en CSS)
    spanError.textContent = mensaje;    // Texto del error
  }


  /* ----------------------------------------------------------
     FUNCIÓN: limpiarError(campo, spanError)
     Quita el estado de error cuando el campo está bien llenado.
  ---------------------------------------------------------- */
  function limpiarError (campo, spanError) {
    campo.classList.remove('error');
    spanError.textContent = '';         // Borra el texto de error
  }


  /* ----------------------------------------------------------
     FUNCIÓN: mostrarModal()
     Muestra el modal de confirmación agregando la clase 'activo'.
     CSS cambia el display a flex cuando tiene esa clase.
  ---------------------------------------------------------- */
  function mostrarModal () {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
      overlay.classList.add('activo');
    }
  }


  /* ----------------------------------------------------------
     FUNCIÓN: cerrarModal() — Definida como global (window.)
     para que el botón del HTML pueda llamarla.
  ---------------------------------------------------------- */
  window.cerrarModal = function () {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
      overlay.classList.remove('activo');
    }
  };


  /* ----------------------------------------------------------
     4. ANIMACIÓN DE SCROLL (INTERSECTION OBSERVER)
     
     Hace que los elementos aparezcan suavemente cuando el
     usuario hace scroll y los elementos entran en pantalla.
     IntersectionObserver es más eficiente que el evento scroll.
  ---------------------------------------------------------- */
  
  // Seleccionamos los elementos que queremos animar
  const elementosAnimados = document.querySelectorAll(
    '.servicio-card, .proyecto-card, .info-item'
  );

  // Opciones del observer: el elemento debe ser 10% visible para activarse
  const opcionesObserver = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  // Creamos el observer con una función callback
  const observer = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        // Si el elemento es visible, agrega la animación
        entrada.target.style.opacity    = '1';
        entrada.target.style.transform  = 'translateY(0)';
        // Una vez animado, dejamos de observarlo (optimización)
        observer.unobserve(entrada.target);
      }
    });
  }, opcionesObserver);

  // Preparamos el estado inicial de los elementos (invisibles y abajo)
  elementosAnimados.forEach(function (elemento) {
    elemento.style.opacity   = '0';
    elemento.style.transform = 'translateY(30px)';
    elemento.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    // Empezamos a observar cada elemento
    observer.observe(elemento);
  });

}); // Fin de DOMContentLoaded
