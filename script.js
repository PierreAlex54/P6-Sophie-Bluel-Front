// récupération des travaux sur l'API

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  //   console.log(works);
  return works;
}

// création div pour HTML "Gallery"
async function createGallery() {
  // declaration constante gallery
  const gallery = document.querySelector("#portfolio .gallery");
  // creation elements qui iront dans gallery
  const works = await getWorks();
  works.forEach((element) => {
    const workFigure = document.createElement("figure");
    const workImg = document.createElement("img");
    const workCaption = document.createElement("figcaption");
    // ajout des elements à gallery
    gallery.appendChild(workFigure);
    workFigure.appendChild(workImg);
    workFigure.appendChild(workCaption);
    // récup et ajout du contenu images et légendes
    workImg.src = element.imageUrl;
    workImg.alt = element.title;
    workCaption.innerText = element.title;
  });
}
createGallery();

// // ajout contenu gallery
// async function showGallery() {
//   const works = await getWorks();
//   const img = document.querySelectorAll(".gallery .img");
//   const caption = document.querySelectorAll(".gallery .figcaption");

//   for (let i = 0; i < works.length; i++) {
//     img.src = works[i].imageUrl;
//     caption.innerText = works[i].title;
//   }
// }
// showGallery();
