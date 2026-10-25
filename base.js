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
      });
    }
    if(inputBusqueda)inputBusqueda.addEventListener("input", filtrarPeliculas);
    if(selectGenero)selectGenero.addEventListener("change", filtrarPeliculas);

    const form = document.getElementById("formLogin");        // guarda el formulario
    const msg = document.getElementById("mensaje");           // guarda el párrafo de mensajes
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}"); // lee cuentas guardadas en el navegador ({} si no hay)

    function mostrarSesion() {                                // muestra u oculta cosas según haya sesión
      const actual = localStorage.getItem("sesion");          // ¿quién está conectado?
      if(form)form.hidden = !!actual;                                 // oculta el formulario si hay sesión
      const btnSalir = document.getElementById("salir");
      if(btnSalir)btnSalir.hidden = !actual;
      document.getElementById("cuenta").hidden = !actual;
      const tituloLogin = document.getElementById("titulo-login");
      if (tituloLogin) tituloLogin.textContent = actual ? "Hola, " + actual : "Inicia sesión";
      const resumenSesion = document.getElementById("resumenSesion");
      if(resumenSesion)resumenSesion.textContent = (actual ? actual : "Iniciar sesión") + " ▾"; // el botón pequeño muestra tu nombre
    }
    if(form){

    }
    form.onsubmit = (e) => {                                  // al pulsar "Entrar"
      e.preventDefault();                                     // evita que la página se recargue
      const u = form.usuario.value.trim();                    // usuario escrito
      const c = form.clave.value;
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}");
      const userObj = usuarios[u];
      const claveValida = typeof userObj === "object" ? userObj.clave === c : userObj === c; // Comprueba que la contraseña sea correcta

      if(userObj && claveValida){                             // ¿existe y la clave coincide?
        localStorage.setItem("sesion", u);                    // guarda quién inició sesión
      const fechaGuardada = typeof userObj === "object" ? userObj.fechaNacimiento : "2000-01-01";
      localStorage.setItem("userBirthdate", fechaGuardada);
      if(msg)msg.textContent = "";                                 // limpia mensajes
      mostrarSesion();                                      // actualiza la pantalla
      const sesionCaja = document.getElementById("sesionCaja") // cierra la cajita después de entrar
      if(sesionCaja)sesionCaja.open = false;
      }else{
        if(msg)msg.textContent = "Usuario o contraseña incorrectos"; // Si la clave es incorrecta o el usuario no existe..
      }
    };

    const btnSalir = document.getElementById("salir");
    if(btnSalir){
      btnSalir.onclick = () => {        // al pulsar "Cerrar sesión"
      localStorage.removeItem("sesion");                      // borra la sesión
      localStorage.removeItem("userBirthdate");               // Borra la fecha de nacimiento
      mostrarSesion();                                        // vuelve a mostrar el formulario
    };
    }

    document.getElementById("perfil").onclick = () => {
      window.location.href = "user.html";
    };
    
    mostrarSesion();                                          // al abrir la página, revisa si ya había sesión

    // SCRIPT DE LOS RANKINGS (2.º y 3.º carrusel)
  (function () {                                              // función que se ejecuta sola, así no choca con las variables del otro script
    const NOTA_MINIMA = 3;                                    // el 2.º carrusel solo incluye películas con promedio de 3 estrellas o más
    const GENERO_TOP = "terror";                              // ← género del 3.º carrusel (ej: "accion", "comedia", "fantasia"...)
    const NOMBRE_GENERO = "terror";                           // ← cómo se escribe ese género en el título

    // 1. Lee las películas desde las tarjetas del primer carrusel (así no hay que repetir datos)
    const base = Array.from(document.querySelectorAll("#carrusel .tarjeta")).map(t => ({ // una ficha de datos por tarjeta
      href: t.getAttribute("href"),                           // archivo de la película, ej: "shrek.html"
      titulo: t.querySelector("span").textContent.trim(),     // nombre y año
      img: t.querySelector("img").getAttribute("src"),        // dirección del afiche
      generos: (t.getAttribute("data-genero") || "").split(" ").filter(Boolean) // géneros como lista, ej: ["fantasia","comedia"]
    }));

    // 2. Lee las reseñas guardadas por las fichas
    const todas = JSON.parse(localStorage.getItem("resenas") || "{}"); // reseñas agrupadas por película
    const fichas = JSON.parse(localStorage.getItem("fichas") || "{}"); // qué archivo corresponde a cada película (lo anota resenas.js)
    const limpiar = s => s.toLowerCase().replace(/[^a-z0-9]/g, ""); // deja solo letras y números, para comparar nombres

    function claveDe(href) {                                  // busca con qué nombre se guardaron las reseñas de este archivo
      const exacta = Object.keys(fichas).find(k => fichas[k] === href); // 1.º: por el registro exacto
      if (exacta) return exacta;                              // si lo encontró, listo
      const h = limpiar(href.replace(".html", ""));           // 2.º: por parecido entre el nombre del archivo y el nombre guardado
      return Object.keys(todas).find(k => { const n = limpiar(k); return n === h || (n.length >= 5 && h.includes(n)); });
    }

    base.forEach(p => {                                       // calcula la nota de cada película
      const notas = (todas[claveDe(p.href)] || []).filter(r => r.estrellas > 0).map(r => r.estrellas); // estrellas de sus reseñas
      p.cantidad = notas.length;                              // cuántas reseñas con estrellas tiene
      p.promedio = notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : 0; // promedio (0 si no tiene)
    });

    const porNota = (a, b) => b.promedio - a.promedio || b.cantidad - a.cantidad; // mayor promedio primero; si empatan, más reseñas primero

    // 3. Dibuja un carrusel dentro de una caja
    function dibujar(idCaja, lista, vacio) {                  // idCaja = dónde va, lista = películas, vacio = mensaje si no hay
      const caja = document.getElementById(idCaja);           // la caja vacía del HTML
      if (!lista.length) { caja.className = "mensaje-carrusel"; caja.textContent = vacio; return; } // sin datos: muestra el aviso
      const izq = document.createElement("button");           // flecha izquierda
      izq.className = "flecha"; izq.textContent = "‹";        // misma clase y dibujo que el primer carrusel
      const der = document.createElement("button");           // flecha derecha
      der.className = "flecha"; der.textContent = "›";        // misma clase y dibujo que el primer carrusel
      const pista = document.createElement("div");            // la lista horizontal
      pista.className = "carrusel";                           // reutiliza TU mismo CSS del carrusel
      lista.forEach((p, i) => {                               // una tarjeta por película (i = posición, empieza en 0)
        const a = document.createElement("a");                // tarjeta clicable
        a.className = "tarjeta"; a.href = p.href;             // mismo diseño que las otras tarjetas, lleva a su ficha
        const img = document.createElement("img");            // afiche
        img.src = p.img; img.alt = "Portada de " + p.titulo;  // imagen y texto alternativo
        const t = document.createElement("span");             // título con su puesto
        t.textContent = (i + 1) + ". " + p.titulo;            // ej: "1. Shrek (2001)"
        a.append(img, t);                                     // arma la tarjeta
        if (p.cantidad) {                                     // si tiene reseñas, muestra su nota
          const n = document.createElement("span");           // línea de la nota
          n.className = "nota-media";                         // clase del CSS (dorado y pequeño)
          n.textContent = "★ " + p.promedio.toFixed(1) + " · " + p.cantidad + (p.cantidad === 1 ? " reseña" : " reseñas"); // ej: ★ 4.5 · 2 reseñas
          a.append(n);                                        // la agrega bajo el título
        }
        pista.append(a);                                      // mete la tarjeta en la lista
      });
      izq.onclick = () => pista.scrollBy(-280, 0);            // flecha izquierda: 280px a la izquierda
      der.onclick = () => pista.scrollBy(280, 0);             // flecha derecha: 280px a la derecha
      caja.append(izq, pista, der);                           // arma el carrusel completo
    }

    // 4. 2.º carrusel: Top 10 con reseñas más positivas
    const positivas = base.filter(p => p.cantidad > 0 && p.promedio >= NOTA_MINIMA).sort(porNota).slice(0, 10); // las mejor valoradas
    document.getElementById("tituloPositivas").textContent = "Top " + (positivas.length || 10) + " películas con reseñas más positivas"; // el número se ajusta si hay menos de 10
    dibujar("cajaPositivas", positivas, "Aún no hay películas con reseñas positivas (" + NOTA_MINIMA + " estrellas o más). ¡Publica la primera reseña!");

    // 5. 3.º carrusel: Top 10 de un género
    const delGenero = base.filter(p => p.generos.includes(GENERO_TOP)).sort(porNota).slice(0, 10); // las de ese género, mejor valoradas primero (las sin reseñas quedan al final, en el orden del catálogo)
    document.getElementById("tituloGenero").textContent = "Top " + (delGenero.length || 10) + " de películas de " + NOMBRE_GENERO; // ej: "Top 5 de películas de terror"
    dibujar("cajaGenero", delGenero, "Todavía no hay películas de " + NOMBRE_GENERO + " en el catálogo.");
  })();