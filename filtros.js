// Función global para calcular la edad exacta a partir de la fecha (YYYY-MM-DD)
function calcularEdadUsuario() {
  const fechaNacStr = localStorage.getItem("userBirthdate");
  if (!fechaNacStr) return 0;
  
  const hoy = new Date();
  const nac = new Date(fechaNacStr);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const mes = hoy.getMonth() - nac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) {
    edad--;
  }
  return edad;
}

// Verifica si la sesión actual cumple con la edad requerida de la película
function esUsuarioAutorizadoParaPelicula() {
  const contenedorFiltro = document.getElementById("filtro-edad-contenedor");
  if (!contenedorFiltro) return true; // Si no hay filtro, se considera apta

  const edadMinima = parseInt(contenedorFiltro.getAttribute("data-edad") || "0", 10);
  const edadUsuario = calcularEdadUsuario();

  return edadUsuario >= edadMinima;
}

// Aplica el efecto visual de bloqueo (desenfoque + aviso)
function aplicarFiltroEdad() {
  const contenedorFiltro = document.getElementById("filtro-edad-contenedor");
  if (!contenedorFiltro) return;

  const edadMinima = parseInt(contenedorFiltro.getAttribute("data-edad") || "0", 10);
  const estaAutorizado = esUsuarioAutorizadoParaPelicula();

  const listaResenas = document.getElementById("listaResenas");
  const overlayOjo = document.getElementById("overlayOjo");

  if (!estaAutorizado) {
    // Si es menor de edad: se aplica el filtro borroso y se muestra el aviso con el ojo
    if (listaResenas) listaResenas.classList.add("reseñas-bloqueadas");
    if (overlayOjo) overlayOjo.classList.remove("oculto");
  } else {
    // Si cumple la edad: se asegura de mostrar las reseñas con claridad
    if (listaResenas) listaResenas.classList.remove("reseñas-bloqueadas");
    if (overlayOjo) overlayOjo.classList.add("oculto");
  }
}

// Ejecutar automáticamente al cargar el DOM
document.addEventListener("DOMContentLoaded", aplicarFiltroEdad);

// Función que ejecuta el botón "Ver reseñas de todas formas"
function desbloquearReseñas() {
  const listaResenas = document.getElementById("listaResenas");
  const overlayOjo = document.getElementById("overlayOjo");

  if (listaResenas) listaResenas.classList.remove("reseñas-bloqueadas");
  if (overlayOjo) overlayOjo.classList.add("oculto");
}

