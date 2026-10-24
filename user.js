const pan = localStorage.getItem("sesion");
document.getElementById("nombre").textContent = pan ? pan : "Texto";

//lista de reseñas

const sesion = localStorage.getItem("sesion");
const todas = JSON.parse(localStorage.getItem("resenas") || "{}");
const caja = document.getElementById("reviews");

caja.textContent = "";

if (!sesion) {
  caja.textContent = "Inicia sesión para ver tus reseñas.";
} else {
  const misResenas = Object.entries(todas).flatMap(([pelicula, resenas]) =>
    resenas
      .filter(r => r.autor === sesion)
      .map(r => ({ ...r, pelicula }))
  );

  if (!misResenas.length) {
    caja.textContent = "Aún no has escrito reseñas.";
  } else {
    misResenas.forEach(r => {
      const div = document.createElement("div");
      div.className = "resena";

      const titulo = document.createElement("strong");
      titulo.textContent = `${r.pelicula} · ${r.fecha}`;

      const texto = document.createElement("p");
      texto.textContent = r.texto;

      div.append(titulo, texto);
      caja.append(div);
    });
  }
}