/**const form = document.getElementById("formLogin");        // guarda el formulario
    const msg = document.getElementById("mensaje");           // guarda el párrafo de mensajes
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}"); // lee cuentas guardadas en el navegador ({} si no hay)
    **/const pan = localStorage.getItem("sesion");/**

    function mostrarSesion() {                                // muestra u oculta cosas según haya sesión
      const actual = localStorage.getItem("sesion");          // ¿quién está conectado?
      form.hidden = !!actual;                                 // oculta el formulario si hay sesión
      document.getElementById("cuenta").hidden = !actual;
      document.getElementById("salir").hidden = !actual;      // muestra "Cerrar sesión" solo si hay sesión
      document.getElementById("titulo-login").textContent = actual ? "Hola, " + actual : "Inicia sesión"; // cambia el título
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
**/
    

      document.getElementById("nombre").textContent = pan ? " " + pan : "Texto";