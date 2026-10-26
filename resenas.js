// ---------- 1. FLECHA SUPERIOR "← Inicio" (una sola, arriba a la izquierda) ----------
if (!document.querySelector(".volver-inicio-superior")) { // solo la crea si la página NO trae ya la suya en el HTML
  const volver = document.createElement("a");             // crea el enlace
  volver.className = "volver-inicio-superior";            // misma clase (mismo diseño) que usan tus fichas
  volver.href = "index.html";                             // lleva a la página principal
  volver.setAttribute("aria-label", "Volver al menú principal"); // descripción para lectores de pantalla
  volver.innerHTML = '<span aria-hidden="true">←</span> Inicio'; // flecha + palabra "Inicio"
  document.body.classList.add("pagina-interna");          // deja espacio arriba para que la flecha no tape el título
  document.body.prepend(volver);                          // la pone al principio de la página
}
// ---------- 1.2 CALCULAR EDAD DEL USUARIO ----------
function obtenerEdadUsuario(fechaStr){
  if (!fechaStr) return 99; // Si no existe la fecha de nacimiento, devuelve 99 como valor determinado para que el usuario no se bloquee
  const hoy = new Date(); // Obtiene la fecha actual (y hora) del sistema para el calculo de la edad el usuario
  const nac = new Date(fechaStr.includes("T") ? fechaStr : fechaStr + "T00:00:00"); // La T se utiliza para separar la fecha actual de la hora
  let edad = hoy.getFullYear() - nac.getFullYear(); // Calcula la edad restando el año actual - el año de nacimiento del usuario. Se utiliza "let" porque esta variable podrá cambiar
  const mes = hoy.getMonth() - nac.getMonth(); // Calcula la diferencia entre los meses actuales y los de nacimiento
  if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())){ // Comprueba si el usuario ya estuvo de cumpleaños este año actual. Si la diferencia de los meses es < 0, todavía no es el cumpleaños del usuario.
    edad--; // Si el usuario aún no ha estado de cumpleaños, le restamos la edad en 1 (esto porque si estuvo de cumpleaños el 2006, en diciembre, y estamos a 2026, en octubre, aún no ha cumplido los 20)
  }
  return edad;
}

// ---------- 2. DATOS DE LA PÁGINA ----------
const peli = document.body.dataset.pelicula;              // nombre de la película, desde <body data-pelicula="...">
const sesion = localStorage.getItem("sesion");            // usuario con sesión iniciada (null si no hay)
const tituloPeli = document.body.dataset.titulo;
let fechaNacimiento = localStorage.getItem("userBirthdate"); // Busca la fecha de cumpleaños almacenada, si no lo encuentra, la variable valdría null
if (!fechaNacimiento && sesion){ // Si no hay una fecha de cumpleaños guardada pero si una sesión iniciada..
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}"); // La parte de JSON covierte el texto almacenado en un objeto JS para poder acceder a los datos
  if (usuarios[sesion] && usuarios[sesion].fechaNacimiento) { // Revisa que el usuario sea el mismo de la sesión iniciada actual y si es que este tiene una fecha de nacimiento guardada
    fechaNacimiento = usuarios[sesion].fechaNacimiento; // Si se cumple lo anterior, se copia la fecha de nacimiento del usuario a una variable
    localStorage.setItem("userBirthdate", fechaNacimiento); // Guarda la fecha en el navegador
  }
}
const contenedorFiltro = document.getElementById("filtro-edad-contenedor"); // Busca el contenedor con la restricción de edad de la película
const edadMinima = contenedorFiltro ? parseInt(contenedorFiltro.getAttribute("data-edad") || "0", 10) : 0; // Valor numérico de data-edad
const edadUsuario = obtenerEdadUsuario(fechaNacimiento); // Calcula la edad del usuario

const todas = JSON.parse(localStorage.getItem("resenas") || "{}"); // todas las reseñas guardadas, agrupadas por película
const lista = todas[peli] || [];                          // reseñas de ESTA película
const fichas = JSON.parse(localStorage.getItem("fichas") || "{}"); // registro de qué archivo es cada película (lo usa la portada para los rankings)
if (peli){
  fichas[peli] = location.pathname.split("/").pop(); // anota el archivo, ej: "shrek"  →  "shrek.html"
  localStorage.setItem("fichas", JSON.stringify(fichas)); // Guarda en el navegador
}
const form = document.getElementById("formResena");       // formulario para escribir la reseña
const aviso = document.getElementById("avisoResena");     // mensaje para quien no ha iniciado sesión
const caja = document.getElementById("listaResenas");     // lugar donde se muestran las reseñas
const overlayOjo = document.getElementById("overlayOjo"); 

// ---------- 2.1 FORMULARIO SEGÚN EDAD ----------  
const esMenor = sesion ? (edadUsuario < edadMinima) : false; // Indica si el usuario tiene una edad menor a la requerida por la película
if (esMenor && edadMinima > 0){ // Comprueba que efectivamente el usuario es menor a la edad mínima requerida y que esta debe ser mayor que 0
  // BLOQUEO VISUAL DE LAS RESEÑAS
  if(caja) caja.classList.add("reseñas-bloqueadas"); // Entra la parte de estilo css para cambiar la aparencia de las reseñas
  if(overlayOjo) overlayOjo.classList.remove("oculto"); // Quita la parte de ocultar en las reseñas
}else{ 
  if (caja) caja.classList.remove("reseñas-bloqueadas"); // Elimina la clase de reseñas-bloquedas, lo opuesto a lo anterior
  if (overlayOjo) overlayOjo.classList.add("oculto"); // Agrega la parte de ocultar
}
if (sesion && !esMenor){ // Verifica si el usuario puede escribir o no una reseña
  if (form) form.hidden = false;  // Muestra el formulario si se inició sesión y tiene más de la edad mínima requerida
  if (aviso) aviso.hidden = true; // Como efectivamente puede escribir una reseña, se oculta el aviso de inicio de sesión
}else{ // Revisión de caso en el que el usuario no pueda escribir la reseña por restricción de edad o no tiene un inicio de sesión
  if (form) form.hidden = true; // Oculta el formulario 
  if (aviso){ // Comprueba si existe el aviso
    aviso.hidden = false; // Muestra el aviso
    if (sesion && esMenor){ // Verifica que el usuario tenga sesión iniciada y que no cumple con la edad mínima requerida 
      aviso.innerHTML = "<strong>Publicación restringida:</strong> Tu cuenta no cumple con la edad mínima para esta película."; // Mensaje de restricción
    }else{ // Revisión en el caso de que el usuario no haya iniciado sesión
      aviso.innerHTML = 'Inicia sesión para escribir una reseña. <a href="index.html">Ir a iniciar sesión</a>'; // Mensaje de inicio de sesión para poder escribir la reseña
    }
  }
}
function desbloquearReseñas(){ 
  if (caja) caja.classList.remove("reseñas-bloqueadas"); // Desbloquea las reseñas para poder verlas
  if (overlayOjo) overlayOjo.classList.add("oculto"); // Desbloquea la parte del ojo que hace que las reseñas se vean bloqueadas
}

// ---------- 3. DIBUJAR ESTRELLAS ----------
function estrellas(n) {                                   // devuelve n estrellas doradas y (5 - n) grises
  const caja5 = document.createElement("span");           // contenedor de las 5 estrellas
  caja5.className = "resena-estrellas";                   // clase del CSS
  caja5.setAttribute("role", "img");                      // se lee como imagen para lectores de pantalla
  caja5.setAttribute("aria-label", n + " de 5 estrellas"); // texto que leen esos lectores
  const llenas = document.createElement("span");          // parte dorada
  llenas.textContent = "★".repeat(n);                     // repite ★ n veces
  const vacias = document.createElement("span");          // parte gris
  vacias.className = "apagadas";                          // clase que las pinta de gris
  vacias.textContent = "★".repeat(5 - n);                 // las que faltan para llegar a 5
  caja5.append(llenas, vacias);                           // une ambas partes
  return caja5;                                           // entrega las estrellas listas
}

// ---------- 4. UNIR LAS ESTRELLAS CON LA RESEÑA ----------
const fichaTexto = document.querySelector(".ficha > p");  // el texto "Califica esta película:" de la ficha
const fichaForm = document.querySelector(".ficha > .star-rating"); // tus estrellas originales de la ficha
const selector = document.createElement("div");           // nuevo contenedor para las estrellas
selector.className = "star-rating";                       // reutiliza TU mismo CSS de estrellas
const error = document.createElement("p");                // párrafo para avisar si faltan estrellas
error.className = "error-resena";                         // clase del CSS (texto rojo claro)

if (fichaForm) {                                          // si la página tiene las estrellas originales
  if (sesion && !esMenor) {                                           // y hay sesión iniciada:
    while (fichaForm.firstChild) selector.append(fichaForm.firstChild); // mueve tus estrellas (inputs y labels) al nuevo contenedor
  }
  fichaForm.remove();                                     // quita el formulario original de la ficha
}
if (sesion && !esMenor) {                                             // con sesión, las estrellas van DENTRO del formulario de reseña
  const etiqueta = document.createElement("p");           // título pequeño sobre las estrellas
  etiqueta.className = "etiqueta-estrellas";              // clase del CSS
  etiqueta.textContent = "Tu calificación:";              // texto
  if(form)form.prepend(etiqueta, selector, error);                // orden: título, estrellas, aviso, y luego la caja de texto
  selector.onchange = () => { error.textContent = ""; };  // al elegir estrellas, borra el aviso de error
}

// ---------- 5. PROMEDIO EN LA FICHA ----------
const promedio = document.createElement("div");           // lugar donde irá el promedio
promedio.className = "promedio";                          // clase del CSS
if (fichaTexto) {                                         // si existe el texto de la ficha
  fichaTexto.textContent = "Valoración de la comunidad:"; // cambia "Califica..." por este título
  fichaTexto.after(promedio);                             // pone el promedio justo debajo
}

function mostrarPromedio() {                              // calcula y dibuja el promedio
  const conNota = lista.filter(r => r.estrellas > 0);     // solo reseñas que traen estrellas
  promedio.innerHTML = "";                                // borra lo anterior
  if (!conNota.length) { promedio.textContent = "Aún sin calificaciones"; return; } // si no hay ninguna, avisa
  const suma = conNota.reduce((total, r) => total + r.estrellas, 0); // suma todas las estrellas
  const prom = suma / conNota.length;                     // promedio = suma ÷ cantidad
  const texto = document.createElement("p");              // texto con el número
  texto.className = "promedio-texto";                     // clase del CSS
  texto.textContent = prom.toFixed(1) + " / 5 · " + conNota.length + (conNota.length === 1 ? " reseña" : " reseñas"); // ej: 4.5 / 5 · 2 reseñas
  promedio.append(estrellas(Math.round(prom)), texto);    // estrellas redondeadas + texto
}

// ---------- 6. GUARDAR Y MOSTRAR RESEÑAS ----------
function guardar() {                                      // guarda los cambios en el navegador
  todas[peli] = lista;                                    // actualiza las reseñas de esta película
  localStorage.setItem("resenas", JSON.stringify(todas)); // las convierte a texto y las guarda
}

function mostrar() {                                      // dibuja la lista de reseñas
  mostrarPromedio();                                      // primero actualiza el promedio de la ficha
  if(!caja) return;
  caja.innerHTML = "";                                    // borra lo que había
  if (!lista.length) { caja.textContent = "Aún no hay reseñas. ¡Sé el primero!"; return; } // mensaje si no hay ninguna
  lista.forEach((r, i) => {                               // repite para cada reseña (r = reseña, i = posición)
    const div = document.createElement("div");            // caja de la reseña
    div.className = "resena";                             // clase del CSS
    const cab = document.createElement("div");            // línea superior: autor y fecha
    cab.className = "resena-cabecera";                    // clase del CSS (autor a la izquierda, fecha a la derecha)
    const autor = document.createElement("strong");       // nombre de usuario
    autor.textContent = r.autor;                          // escribe el nombre
    const fecha = document.createElement("span");         // fecha de la reseña
    fecha.className = "resena-fecha";                     // clase del CSS
    fecha.textContent = r.fecha;                          // escribe la fecha
    cab.append(autor, fecha);                             // une autor y fecha
    div.append(cab);                                      // los pone arriba de la reseña
    if (r.estrellas) div.append(estrellas(r.estrellas));  // si la reseña tiene estrellas, las muestra debajo
    const texto = document.createElement("p");            // comentario
    texto.textContent = r.texto;                          // textContent evita que se ejecute código HTML escrito por alguien
    div.append(texto);                                    // pone el comentario al final
    if (r.autor === sesion) {                             // solo el autor puede eliminar su reseña
      const b = document.createElement("button");         // crea el botón
      b.textContent = "Eliminar";                         // texto del botón
      b.onclick = () => {                                 // al hacer clic
        if (confirm("¿Eliminar tu reseña?")) {            // pide confirmación
          lista.splice(i, 1);                             // quita la reseña de la lista
          guardar();                                      // guarda el cambio
          mostrar();                                      // vuelve a dibujar (y recalcula el promedio)
        }
      };
      div.append(b);                                      // agrega el botón a la reseña
    }
    caja.append(div);                                     // agrega la reseña a la página
  });
}

if(form){
  form.onsubmit = (e) => {                                  // al publicar la reseña
  e.preventDefault();                                     // evita que se recargue la página
  const marcada = form.querySelector('input[name="rating"]:checked'); // estrella elegida (null si no eligió)
  const t = form.elements.texto.value.trim();                      // texto escrito, sin espacios sobrantes
  if (!marcada) { error.textContent = "Elige de 1 a 5 estrellas para publicar"; return; } // sin estrellas no se publica
  if (!t) return;                                         // si el texto está vacío, no hace nada
  lista.unshift({                                         // agrega la reseña al inicio de la lista
    autor: sesion,                                        // quién la escribió
    estrellas: Number(marcada.value),                     // cuántas estrellas puso (1 a 5)
    texto: t,                                             // el comentario
    fecha: new Date().toLocaleDateString("es-CL"),         // fecha de hoy
    titulo: tituloPeli
  });
  guardar();                                              // guarda en el navegador
  form.reset();                                           // limpia estrellas y caja de texto
  mostrar();                                              // actualiza reseñas y promedio
};
}
mostrar();                                                // al abrir la página, muestra las reseñas existentes

