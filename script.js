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
    // ajout de l'ID category à chaque figure
    workFigure.dataset.workId = element.categoryId;
    console.log(workFigure.dataset.workId);

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

// récupération catégories API

async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  console.log(categories);
  return categories;
}

// création boutons catégories

async function createCategories() {
  const filters = document.createElement("div");
  filters.className = "filters";
  const gallery = document.querySelector(".gallery");
  gallery.parentNode.insertBefore(filters, gallery);

  const btnTous = document.createElement("button");
  btnTous.innerText = "Tous";
  btnTous.className = "filterBtn";
  filters.appendChild(btnTous);

  btnTous.dataset.btnId = 0;
  console.log(btnTous.id);

  const categories = await getCategories();
  categories.forEach((element) => {
    const filtersBtn = document.createElement("button");
    filtersBtn.innerText = element.name;
    filtersBtn.className = "filterBtn";
    filters.appendChild(filtersBtn);

    filtersBtn.dataset.btnId = element.id;
    console.log(filtersBtn.dataset.btnId);
  });
  await activFilters();
}

async function activFilters() {
  const buttons = document.querySelectorAll(".filterBtn");
  buttons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      // récupération de l'ID du bouton cliqué
      const btnId = event.target.dataset.btnId;
      console.log(event.target.dataset.btnId);
      const figures = document.querySelectorAll("#portfolio .gallery figure");

      figures.forEach((figure) => {
        if (btnId === "0" || figure.dataset.workId === btnId) {
          figure.style.display = "block";
        } else {
          figure.style.display = "none";
        }
      });
    });
  });
}

const tokenOn = localStorage.getItem("token");
console.log(tokenOn);

if (tokenOn) {
  const login = document.querySelector(".login");
  const logout = document.querySelector(".logout");
  login.style.display = "none";
  logout.style.display = "block";
  editModBar();
  editModGallery();

  logout.addEventListener("click", function () {
    localStorage.removeItem("token");
    login.style.display = "block";
    logout.style.display = "none";
  });
} else {
  createCategories();
}

function editModBar() {
  const body = document.querySelector("body");
  const divTop = document.createElement("div");
  const icon = document.createElement("i");
  const text = document.createElement("p");
  icon.className = "fa-regular fa-pen-to-square";
  text.innerText = "Mode édition";
  divTop.appendChild(icon);
  divTop.appendChild(text);
  divTop.classList.add("topBar");
  body.insertAdjacentElement("afterbegin", divTop);
}

function editModGallery() {
  const h2 = document.querySelector("#portfolio h2");
  const divAdminGallery = document.createElement("div");
  const newh2 = document.createElement("h2");
  const icon = document.createElement("i");
  const text = document.createElement("p");
  newh2.innerText = "Mes Projets";
  icon.className = "fa-regular fa-pen-to-square";
  text.innerText = "modifier";
  divAdminGallery.appendChild(newh2);
  divAdminGallery.appendChild(icon);
  divAdminGallery.appendChild(text);
  divAdminGallery.classList.add("divAdminGallery");
  h2.parentNode.replaceChild(divAdminGallery, h2);
}
