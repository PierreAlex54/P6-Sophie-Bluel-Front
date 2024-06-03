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
  // effacer le contenu actuel de la galerie
  gallery.innerHTML = "";
  // creation elements qui iront dans gallery
  const works = await getWorks();
  works.forEach((element) => {
    const workFigure = document.createElement("figure");
    const workImg = document.createElement("img");
    const workCaption = document.createElement("figcaption");
    // ajout de l'ID category à chaque figure
    workFigure.dataset.workId = element.categoryId;
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
    window.location.reload();
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
  icon.classList.add("openModal");
  text.classList.add("openModal");
  h2.parentNode.replaceChild(divAdminGallery, h2);
}

// affichage galerie modale

// affichage galerie modale
async function createModalGallery() {
  // declaration constante gallery
  const gallery = document.querySelector(".modal .modalGallery");
  // effacer le contenu actuel de la galerie
  gallery.innerHTML = "";
  // creation elements qui iront dans gallery
  const works = await getWorks();
  works.forEach((element) => {
    const workFigure = document.createElement("figure");
    const workImg = document.createElement("img");
    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash-can";
    // ajout de l'ID category à chaque figure
    workFigure.dataset.workId = element.id;
    // ajout des elements à gallery
    gallery.appendChild(workFigure);
    workFigure.appendChild(workImg);
    workFigure.appendChild(trashIcon);
    // récup et ajout du contenu images et légendes
    workImg.src = element.imageUrl;
    workImg.alt = element.title;
  });
  deleteWorks(); // Réinitialiser les événements de suppression
}
createModalGallery();

function deleteWorks() {
  const trashIcons = document.querySelectorAll(".fa-trash-can");
  trashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener("click", async function () {
      console.log(trashIcons);
      const confirmDelete = confirm(
        "Êtes-vous sûr de vouloir supprimer cette image ?"
      );
      if (confirmDelete) {
        const workFigure = trashIcon.parentElement;
        const workId = workFigure.dataset.workId;
        // Envoi de la requête DELETE au serveur pour supprimer l'image de la base de données
        await fetch(`http://localhost:5678/api/works/${workId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenOn}`,
            "Content-Type": "application/json",
          },
        });
        // Suppression de l'image du DOM
        await createGallery();
        await createModalGallery();
      }
    });
  });
}

// Gestion ouverture/fermeture fenêtre modale

let modal = null;

const openModals = document.querySelectorAll(".openModal");
openModals.forEach((openModal) => {
  openModal.addEventListener("click", function (e) {
    e.preventDefault();
    const showModal = document.getElementById("modal1");
    showModal.style.display = null;
    showModal.removeAttribute("aria-hidden");
    showModal.setAttribute("aria-modal", "true");
    modal = showModal;
    modal.addEventListener("click", closeModal);
    modal.querySelector(".closeModal").addEventListener("click", closeModal);
    modal.querySelector(".closeModal1").addEventListener("click", closeModal);
    modal
      .querySelector(".modalStopProp")
      .addEventListener("click", stopPropagation);
  });
});

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".closeModal").removeEventListener("click", closeModal);
  modal.querySelector(".closeModal1").removeEventListener("click", closeModal);
  modal
    .querySelector(".modalStopProp")
    .removeEventListener("click", stopPropagation);
  modal = null;
  removePrevImg();
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

// Gestion entre les 2 affichages de la modale

const picGallery = document.getElementById("picGallery");
const picsAdd = document.getElementById("picsAdd");
const addPhotoBtn = document.querySelector("#picGallery input[type='submit']");
const backButton = document.querySelector("#picsAdd .fa-arrow-left");

addPhotoBtn.addEventListener("click", function () {
  picGallery.style.display = "none";
  picsAdd.style.display = null;
});

backButton.addEventListener("click", function () {
  picsAdd.style.display = "none";
  picGallery.style.display = null;
  removePrevImg();
});

picGallery.addEventListener("click", stopPropagation);
picsAdd.addEventListener("click", stopPropagation);

// gestion du formulaire d'ajout de photos

// Déclencher le clic de l'élément d'entrée de fichier lorsqu'un utilisateur clique sur le bouton stylisé
const fileBtn = document.querySelector(".customFileButton");
const addFile = document.querySelector("#fileIn");

fileBtn.addEventListener("click", function () {
  addFile.click();
  console.log("Bouton cliqué");
});
// prévisu de l'image ajoutée
addFile.addEventListener("change", function () {
  const image = this.files[0];
  console.log(image);
  if (image.size <= 4000000) {
    const reader = new FileReader();
    reader.onload = () => {
      // const allImg = picAdd.querySelectorAll("img");
      // allImg.forEach((item) => item.remove());
      const imgUrl = reader.result;
      const img = document.createElement("img");
      const picAdd = document.querySelector(".picAdd");
      const hideBtn = document.querySelector("#picAddBtn");
      img.src = imgUrl;
      picAdd.appendChild(img);
      hideBtn.style.display = "none";
    };
    reader.readAsDataURL(image);
  } else {
    alert("Veuillez choisir une image de 4mb maxi");
  }
});

// gestion des catégories dans le menu déroulant de la modale

async function modalCategories() {
  const picCatSelect = document.getElementById("picCatSelect");

  const categories = await getCategories();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    picCatSelect.appendChild(option);
  });
}
modalCategories();

// Gestion validation du formulaire

const fileInput = document.getElementById("fileIn");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("picCatSelect");
const submitBtn = document.getElementById("addFormBtn");

fileInput.addEventListener("change", onChange);
titleInput.addEventListener("change", onChange);
categorySelect.addEventListener("change", onChange);

function onChange() {
  const fileOK = fileInput.files.length > 0;
  const titleOK = titleInput.value !== "";
  const categoryOK = categorySelect.value !== "";
  if (fileOK && titleOK && categoryOK) {
    submitBtn.classList.remove("disabledBtn");
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.classList.add("disabledBtn");
    submitBtn.setAttribute("disabled", true);
  }
}
onChange();

const picAddSubmit = document.querySelector(".picAddForm form");

picAddSubmit.addEventListener("submit", async function (event) {
  event.preventDefault();
  const formData = new FormData();
  formData.append("title", titleInput.value);
  formData.append("category", categorySelect.value);
  formData.append("image", fileInput.files[0]);

  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenOn}`,
    },
    body: formData,
  });
  console.log(response);
  if (response.ok) {
    alert("Travail envoyé avec succès !");
    // Ajouter le nouveau travail à la galerie

    await createGallery();
    await createModalGallery();
    removePrevImg();
    // addWorkToGallery(newWork);
  } else if (response.status === 400) {
    alert("Erreur : Demande incorrecte !");
  } else if (response.status === 401) {
    alert("Erreur : Utilisateur non reconnu !");
  } else {
    alert("Erreur inattendue !");
  }
});

// Fonction de réinitialisation du formulaire
function removePrevImg() {
  const imgs = document.querySelectorAll(".picAdd img");
  imgs.forEach((img) => img.remove());
  picAddSubmit.reset();
  onChange();
  const hideBtn = document.querySelector("#picAddBtn");
  hideBtn.style.display = "flex";
}

// Ajouter un travail à la galerie principale et à la galerie modale
// function addWorkToGallery(work) {
//   const mainGallery = document.querySelector("#portfolio .gallery");
//   const modalGallery = document.querySelector(".modal .modalGallery");

//   const workFigureMain = document.createElement("figure");
//   const workFigureModal = document.createElement("figure");

//   const workImgMain = document.createElement("img");
//   const workImgModal = document.createElement("img");

//   const workCaptionMain = document.createElement("figcaption");
//   const workCaptionModal = document.createElement("figcaption");

//   workFigureMain.dataset.workId = work.categoryId;
//   workFigureModal.dataset.workId = work.categoryId;

//   workImgMain.src = work.imageUrl;
//   workImgModal.src = work.imageUrl;

//   workImgMain.alt = work.title;
//   workImgModal.alt = work.title;

//   workCaptionMain.innerText = work.title;
//   workCaptionModal.innerText = work.title;

// Ajouter le travail à la galerie principale
// mainGallery.appendChild(workFigureMain);
// workFigureMain.appendChild(workImgMain);
// workFigureMain.appendChild(workCaptionMain);

// Ajouter le travail à la galerie modale
//   modalGallery.appendChild(workFigureModal);
//   workFigureModal.appendChild(workImgModal);
//   workFigureModal.appendChild(workCaptionModal);
// }
