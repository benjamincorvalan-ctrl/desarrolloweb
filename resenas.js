const peli = document.body.dataset.pelicula;             // lee el nombre de la película desde <body data-pelicula="...">
const sesion = localStorage.getItem("sesion");           // usuario con sesión iniciada (null si no hay)
const todas = JSON.parse(localStorage.getItem("resenas") || "{}"); // todas las reseñas guardadas, agrupadas por película
const lista = todas[peli] || [];                         // reseñas de ESTA película (lista vacía si no hay)
const form = document.getElementById("formResena");      // formulario para escribir
const aviso = document.getElementById("avisoResena");    // mensaje para quien no ha iniciado sesión
const caja = document.getElementById("listaResenas");    // lugar donde se muestran las reseñas

form.hidden = !sesion;                                   // el formulario se ve SOLO si hay sesión
aviso.hidden = !!sesion;                                 // el aviso se ve SOLO si no hay sesión

function guardar() {                                     // guarda los cambios en el navegador
  todas[peli] = lista;                                   // actualiza las reseñas de esta película
  localStorage.setItem("resenas", JSON.stringify(todas)); // las convierte a texto y las guarda
}

function mostrar() {                                     // dibuja la lista de reseñas en pantalla
  caja.innerHTML = "";                                   // borra lo que había
  if (!lista.length) { caja.textContent = "Aún no hay reseñas. ¡Sé el primero!"; return; } // mensaje si no hay ninguna
  lista.forEach((r, i) => {                              // repite para cada reseña (r = reseña, i = posición)
    const div = document.createElement("div");           // crea la caja de la reseña
    div.className = "resena";                            // le pone la clase del CSS
    const autor = document.createElement("strong");      // crea el texto del autor
    autor.textContent = r.autor + " · " + r.fecha;       // autor y fecha
    const texto = document.createElement("p");           // crea el párrafo del comentario
    texto.textContent = r.texto;                         // textContent evita que se ejecute código HTML escrito por alguien
    div.append(autor, texto);                            // mete autor y texto en la caja
    if (r.autor === sesion) {                            // solo el autor puede eliminar su reseña
      const b = document.createElement("button");        // crea el botón
      b.textContent = "Eliminar";                        // texto del botón
      b.onclick = () => {                                // al hacer clic
        if (confirm("¿Eliminar tu reseña?")) {           // pide confirmación
          lista.splice(i, 1);                            // quita la reseña de la lista
          guardar();                                     // guarda el cambio
          mostrar();                                     // vuelve a dibujar
        }
      };
      div.append(b);                                     // agrega el botón a la caja
    }
    caja.append(div);                                    // agrega la reseña a la página
  });
}

form.onsubmit = (e) => {                                 // al publicar
  e.preventDefault();                                    // evita que se recargue la página
  const t = form.texto.value.trim();                     // texto escrito, sin espacios sobrantes
  if (!t) return;                                        // si está vacío, no hace nada
  lista.unshift({ autor: sesion, texto: t, fecha: new Date().toLocaleDateString("es-CL") }); // agrega al inicio con autor y fecha
  guardar();                                             // guarda
  form.reset();                                          // limpia la caja de texto
  mostrar();                                             // actualiza la lista
};

mostrar();                                               // al abrir la página, muestra las reseñas existentes