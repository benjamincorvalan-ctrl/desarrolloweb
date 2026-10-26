const pan = localStorage.getItem("sesion");       //solo busca la sesion y pone el nombre de usuario en el perfil
document.getElementById("nombre").textContent = pan ? pan : "Texto";

//lista de reseñas

const sesion = localStorage.getItem("sesion");    //busca sesion
const todas = JSON.parse(localStorage.getItem("resenas") || "{}");    //agarra TODAS las reseñas existentes
const caja = document.getElementById("reviews");      //recibe el lugar donde pondra las reseñas
const titulo = document.body.dataset.titulo;      //recibe titulo de la peli

caja.textContent = "";

if (!sesion) {
  caja.textContent = "Inicia sesión para ver tus reseñas.";         //si no hay sesion explica que se debe iniciar sesion :^
} else {
  const misResenas = Object.entries(todas).flatMap(([pelicula, resenas]) =>     //busca entre todas las reseñas que existen cuales son de este usuario especifico
    resenas
      .filter(r => r.autor === sesion)
      .map(r => ({ ...r, pelicula }))
  );

  if (!misResenas.length) {                 //si no detecta reseñas en el usuario avisa
    caja.textContent = "Aún no has escrito reseñas.";
  } else {
    misResenas.forEach(r => {         //se crea el espacio de la reseña
      const div = document.createElement("div");
      div.className = "resena";

      const titulo = document.createElement("strong");      //titulo y fecha
      titulo.textContent = `${r.titulo || r.pelicula} · ${r.fecha}`;

      const texto = document.createElement("p");      //texto de la reseña
      texto.textContent = r.texto;

      div.append(titulo, texto);
      caja.append(div);
    });
  }
}