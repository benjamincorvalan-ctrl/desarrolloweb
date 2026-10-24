const carrusel = document.getElementById("carrusel");     // guarda el carrusel en una variable
    document.getElementById("izq").onclick = () => carrusel.scrollBy(-280, 0); // flecha izq: mueve 280px a la izquierda
    document.getElementById("der").onclick = () => carrusel.scrollBy(280, 0);  // flecha der: mueve 280px a la derecha
    //ME PIERDO CON TANTAS LETRAS
    const inputBusqueda = document.getElementById('inputBusqueda');
    const selectGenero = document.getElementById('selectGenero');
    const tarjetaPeli = document.querySelectorAll('.tarjeta');

    function filtrarPeliculas(){
      const texto = inputBusqueda ? inputBusqueda.value.toLowerCase().trim(): "";
      const genero = selectGenero ? selectGenero.value.toLowerCase(): "todos";

      tarjetaPeli.forEach(tarjeta => {
        const titulo = tarjeta.getAttribute("data-titulo") ? tarjeta.getAttribute("data-titulo").toLowerCase(): "";
        const generosP = tarjeta.getAttribute("data-genero") ? tarjeta.getAttribute("data-genero").toLocaleLowerCase():"";
        const coincideTexto = titulo.includes(texto);
        const coincideGenero = genero === "todos" || generosP.includes(genero);
        if(coincideGenero && coincideTexto){
          tarjeta.classList.remove("oculto");
        }else{
          tarjeta.classList.add("oculto");
        }
      }
      );
    }
    inputBusqueda.addEventListener("input", filtrarPeliculas);
    selectGenero.addEventListener("change", filtrarPeliculas);

    const form = document.getElementById("formLogin");        // guarda el formulario
    const msg = document.getElementById("mensaje");           // guarda el párrafo de mensajes
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}"); // lee cuentas guardadas en el navegador ({} si no hay)

    function mostrarSesion() {                                // muestra u oculta cosas según haya sesión
      const actual = localStorage.getItem("sesion");          // ¿quién está conectado?
      form.hidden = !!actual;                                 // oculta el formulario si hay sesión
      document.getElementById("salir").hidden = !actual;      // muestra "Cerrar sesión" solo si hay sesión
      document.getElementById("cuenta").hidden = !actual;
      document.getElementById("titulo-login").textContent = actual ? "Hola, " + actual : "Inicia sesión"; // cambia el título
      document.getElementById("resumenSesion").textContent = (actual ? actual : "Iniciar sesión") + " ▾"; // el botón pequeño muestra tu nombre
    }

    document.getElementById("registrar").onclick = () => {    // al pulsar "Crear cuenta"
      const u = form.usuario.value.trim(), c = form.clave.value; // toma usuario (sin espacios sobrantes) y clave
      if (!u || !c) { msg.textContent = "Completa ambos campos"; return; } // si falta algo, avisa y termina
      if (usuarios[u]) { msg.textContent = "Ese usuario ya existe"; return; } // evita duplicados
      usuarios[u] = c;                                        // guarda la cuenta
      localStorage.setItem("usuarios", JSON.stringify(usuarios)); // la persiste en el navegador
      msg.textContent = "Cuenta creada, ahora pulsa Entrar";  // confirma
    };

    form.onsubmit = (e) => {                                  // al pulsar "Entrar"
      e.preventDefault();                                     // evita que la página se recargue
      const u = form.usuario.value.trim();                    // usuario escrito
      if (usuarios[u] && usuarios[u] === form.clave.value) {  // ¿existe y la clave coincide?
        localStorage.setItem("sesion", u);                    // guarda quién inició sesión
        msg.textContent = "";                                 // limpia mensajes
        mostrarSesion();                                      // actualiza la pantalla
        document.getElementById("sesionCaja").open = false; // cierra la cajita después de entrar
      } else msg.textContent = "Usuario o contraseña incorrectos"; // si no, error
    };

    document.getElementById("salir").onclick = () => {        // al pulsar "Cerrar sesión"
      localStorage.removeItem("sesion");                      // borra la sesión
      mostrarSesion();                                        // vuelve a mostrar el formulario
    };

    document.getElementById("cuenta").onclick = () => {
      window.location.href = "user.html";
    };

    mostrarSesion();                                          // al abrir la página, revisa si ya había sesión