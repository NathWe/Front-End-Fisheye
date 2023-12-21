// Importez MediaFactory et définissez vos interfaces ici...
import { MediaFactory, Media } from "../models/mediafactory";

//variables globales
let photographerId: number | null;
let likesData: { [key: number]: number };
let jsonData: { photographers: Photographer[]; media: Media[] };
const gallery: Media[] = [];

// Interface pour décrire la structure d'un photographe
interface Photographer {
  id: number;
  name: string;
  city: string;
  country: string;
  tagline: string;
  portrait: string;
}

// Constantes pour les sélecteurs de classe
const SELECTOR_MEDIA_CONTAINER = "#media-container";

// Fonction utilitaire pour obtenir un élément par sélecteur de classe
function getElementBySelector(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

// Fonction pour obtenir le tarif/jour
function getDailyRate(photographerId: number, mediaData: Media[]) {
  // Calcule le tarif/jour
  const photographerMedia = mediaData.filter(
    (media) => media.photographerId === photographerId
  );
  const totalDailyRate = photographerMedia.reduce(
    (sum, media) => sum + media.price,
    0
  );
  return totalDailyRate;
}

// Fonction principale pour la page du photographe
async function main() {
  console.log("Entering main function.");

  try {
    // Utilise fetch pour récupérer les données JSON de manière asynchrone
    const response = await fetch("/data/photographer.json?url");

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données JSON.");
    }

    jsonData = await response.json();
    console.log("Données JSON :", jsonData);

    photographerId = getPhotographerIdFromUrl();

    // Charge les données de likes depuis le stockage local
    likesData = JSON.parse(localStorage.getItem("likesData") || "{}");

    if (!photographerId) {
      console.error("Aucun ID de photographe spécifié dans l'URL.");
      return;
    }

    // Trouve le photographe correspondant dans les données
    const photographer = jsonData.photographers.find(
      (p) => p.id === photographerId
    );

    if (!photographer) {
      console.error("Aucun photographe trouvé avec l'ID spécifié.");
      return;
    }

    console.log("Photographe trouvé :", photographer);
    // Appelle la fonction pour afficher les réalisations du photographe
    displayPhotographerWork(
      photographerId,
      jsonData.media,
      jsonData.photographers
    );

    // Appelle la fonction pour afficher le nombre total de likes et le tarif par jour
    displayTotalLikesAndDailyRate(photographerId, jsonData.media);
  } catch (error) {
    console.error("Une erreur est survenue :", error);
  }

  document
    .getElementById("contactForm")
    ?.addEventListener("submit", submitForm);

  // Ajout un gestionnaire d'événement au bouton "Contactez-moi"
  const openContactModalButton = document.getElementById(
    "openContactModalButton"
  );
  openContactModalButton?.addEventListener("click", () => {
    openContactModal();
  });
}

// Fonction pour afficher les réalisations d'un photographe
function displayPhotographerWork(
  photographerId: number,
  mediaData: Media[],
  photographerData: Photographer[]
) {
  // affiche les réalisations du photographe sur la page
  const mediaContainer = document.querySelector(SELECTOR_MEDIA_CONTAINER);

  if (!mediaContainer) {
    console.error("Media container not found in the document.");
    return;
  }
  console.log("Media container found:", mediaContainer);

  const photographerMedia = mediaData
    .filter((media) => media.photographerId === photographerId)
    .map((media) => MediaFactory.createMedia(media));

  console.log("Photographer media:", photographerMedia);

  photographerMedia.forEach((media) => {
    const photographerFolderName = getPhotographerFolderName(
      photographerId,
      photographerData
    );
    const mediaElement = createMediaElement(media, photographerFolderName);

    console.log("Media element created:", mediaElement);

    // Initialise le nombre de likes au moment de la création de l'élément média
    const likesCountElement = mediaElement.querySelector(".likes p");
    if (likesCountElement) {
      const mediaId = media.id;
      likesCountElement.textContent = (
        media.likes + (likesData[mediaId] || 0)
      ).toString();
    }

    // Ajoute un gestionnaire de clic sur le cœur pour chaque élément média
    const heartIcon = mediaElement.querySelector(".likes span");
    if (heartIcon) {
      heartIcon.addEventListener("click", () => handleLikeClick(media.id));
    }

    mediaContainer.appendChild(mediaElement);
  });

  // Ajoute l'événement clic à mediaContainer lors de la création de la page
  mediaContainer.addEventListener("click", (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("likes")) {
      // Si le clic est sur l'icône de cœur, récupère l'ID du média et appelle handleLikeClick
      const mediaIdString = target.getAttribute("data-media-id");
      if (mediaIdString) {
        const mediaId = parseInt(mediaIdString, 10);
        handleLikeClick(mediaId);
      }
    }
  });
  console.log("Media elements added to media container.");
}
// Fonction pour créer un élément HTML pour un média
function createMediaElement(
  media: Media,
  photographerFolderName: string
): HTMLElement {
  const mediaElement = document.createElement("div");
  mediaElement.classList.add("media-item");

  if (media.image) {
    const imgElement = document.createElement("img");
    imgElement.src = `assets/photographers/${photographerFolderName}/${media.image}`;
    imgElement.alt = media.title;
    imgElement.classList.add("media-image");

    const mediaDetailsContainer = document.createElement("div");
    mediaDetailsContainer.classList.add("media-details-container");

    const mediaDetails = document.createElement("div");
    mediaDetails.classList.add("media-details");

    const titleElement = document.createElement("h3");
    titleElement.textContent = media.title;
    titleElement.classList.add("media-title");

    const likesElement = document.createElement("div");
    likesElement.classList.add("likes");

    const likesNumberElement = document.createElement("p");
    likesNumberElement.setAttribute("data-media-id", media.id.toString());
    likesNumberElement.id = `likes-count-${media.id}`;
    likesNumberElement.textContent = `${media.likes}`;
    likesElement.appendChild(likesNumberElement);

    const heartElement = document.createElement("span");
    heartElement.textContent = "❤";
    likesElement.appendChild(heartElement);

    mediaDetails.appendChild(titleElement);
    mediaDetails.appendChild(likesElement);

    mediaDetailsContainer.appendChild(mediaDetails);
    mediaElement.appendChild(imgElement);
    mediaElement.appendChild(mediaDetailsContainer);
  } else if (media.video) {
    const videoElement = document.createElement("video");
    videoElement.controls = true;
    videoElement.width = 400;
    videoElement.height = 300;

    const sourceElement = document.createElement("source");
    sourceElement.src = `assets/photographers/${photographerFolderName}/${media.video}`;
    sourceElement.type = "video/mp4";

    videoElement.appendChild(sourceElement);

    const mediaDetails = document.createElement("div");
    mediaDetails.classList.add("media-details");
    mediaDetails.innerHTML = `
      <h3>${media.title}</h3>
      <p>${media.likes} Likes</p>
    `;

    mediaElement.appendChild(videoElement);
    mediaElement.appendChild(mediaDetails);
  }

  return mediaElement;
}

// Fonction pour obtenir le nom du dossier du photographe en fonction de l'ID
function getPhotographerFolderName(
  photographerId: number,
  photographerData: Photographer[]
): string {
  const photographer = photographerData.find((p) => p.id === photographerId);
  return photographer
    ? photographer.portrait.replace(".jpg", "")
    : `photographer_${photographerId}`;
}

// Fonction pour obtenir l'ID du photographe à partir de l'URL
function getPhotographerIdFromUrl(): number | null {
  const urlParams = new URLSearchParams(window.location.search);
  const photographerIdParam = urlParams.get("id");
  return photographerIdParam ? parseInt(photographerIdParam, 10) : null;
}

function handleLikeClick(mediaId: number) {
  console.log(`Clic sur le cœur détecté pour la photo ${mediaId}`);

  if (!photographerId) return;

  // Initialise likesData si ce n'est pas déjà fait
  likesData[mediaId] = likesData[mediaId] ?? 0;

  // Avant l'incrémentation
  console.log("Avant l'incrémentation : ", likesData[mediaId]);

  // Incrémente le nombre de likes pour la photo spécifique
  likesData[mediaId]++;

  // Après l'incrémentation
  console.log("Après l'incrémentation : ", likesData[mediaId]);

  // Met à jour l'affichage du nombre de likes pour la photo spécifique
  const likesCountElement = getElementBySelector(`#likes-count-${mediaId}`);
  console.log(`.likes-count-${mediaId}`);
  if (likesCountElement) {
    likesCountElement.textContent = (
      parseInt(likesCountElement.textContent || "0") + 1
    ).toString();
  }

  // Met à jour le nombre total de likes et le tarif par jour
  displayTotalLikesAndDailyRate(photographerId, jsonData.media);
  console.log(`Likes mis à jour pour la photo ${mediaId}`);

  // Sauvegarde les données de likes dans le stockage local
  localStorage.setItem("likesData", JSON.stringify(likesData));
}

// Fonction pour afficher le nombre total de likes et le tarif par jour
function displayTotalLikesAndDailyRate(
  photographerId: number,
  mediaData: Media[]
): void {
  if (!photographerId) return;

  const totalLikesCountElement = getElementBySelector("#likes-count");
  const rateValueElement = getElementBySelector("#rate-value");

  if (!totalLikesCountElement || !rateValueElement) return;

  // Récupère le nombre initial de likes depuis l'élément HTML
  const initialLikes = parseInt(
    totalLikesCountElement.dataset.initialLikes || "0",
    10
  );

  // Récupère les likes incrémentés depuis le stockage local
  const additionalLikes = parseInt(
    localStorage.getItem("additionalLikes") || "0",
    10
  );

  // Utilise mediaData pour calculer le nombre total de likes (y compris les likes initiaux)
  const totalLikes = likesData
    ? Object.values(likesData).reduce((sum, likes) => sum + likes, 0)
    : mediaData
        .filter((media) => media.photographerId === photographerId)
        .reduce((sum, media) => sum + media.likes, 0) +
      initialLikes +
      additionalLikes;

  // Affiche le nombre total de likes
  totalLikesCountElement.textContent = totalLikes.toString();

  // Affiche le tarif par jour
  rateValueElement.textContent = getDailyRate(
    photographerId,
    mediaData
  ).toString();
}
// Fonction pour trier les images en fonction de l'option sélectionnée
function sortImages(gallery: Media[], sortBy: string) {
  console.log("Sorting images by:", sortBy);
  switch (sortBy) {
    case "popularité":
      gallery.sort((a, b) => b.likes - a.likes);
      break;
    case "date":
      gallery.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      break;
    case "titre":
      gallery.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }
  console.log("Sorted gallery:", gallery);
  // Met à jour l'affichage des images après le tri
  updateGalleryDisplay(gallery);
}
// Fonction pour mettre à jour l'affichage de la galerie après le tri
function updateGalleryDisplay(gallery: Media[]) {
  const mediaContainer = getElementBySelector(SELECTOR_MEDIA_CONTAINER);
  if (mediaContainer) {
    // Supprime toutes les images actuelles dans le conteneur
    mediaContainer.innerHTML = "";

    // Ajoute les images triées à nouveau dans le conteneur
    gallery.forEach((media) => {
      const photographerFolderName = getPhotographerFolderName(
        photographerId || 0,
        jsonData.photographers
      );
      const mediaElement = createMediaElement(media, photographerFolderName);
      mediaContainer.appendChild(mediaElement);
    });
  }
}
// Ajoute un gestionnaire d'événement au bouton "Trier par"
const sortMenuButton = document.getElementById("sortMenuButton");
if (sortMenuButton) {
  sortMenuButton.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const sortBy = target.textContent?.toLowerCase() ?? "";
    console.log("Sort By:", sortBy);
    sortImages(gallery, sortBy);

    // Empêche le clic de provoquer une navigation
    e.preventDefault();
  });
}

// modale

// Ajout un gestionnaire d'événement au bouton "Contactez-moi"
const openContactModalButton = document.getElementById(
  "openContactModalButton"
);
if (openContactModalButton) {
  openContactModalButton.addEventListener("click", () => {
    openContactModal();
  });
}
// Fonction pour ouvrir la modale
function openContactModal() {
  console.log("Trying to open modal");

  // Récupère les informations du photographe depuis la page
  const photographerNameElement = document.querySelector(".photographer-name");
  const photographerName = photographerNameElement
    ? photographerNameElement.textContent
    : "Photographe";

  // Récupère les éléments de la modale
  const modalOverlay = document.getElementById("modalOverlay");
  const modal = document.getElementById("modal");
  const modalHeader = document.querySelector("#photographerName");

  // Ajoutez ces logs pour voir si les éléments sont correctement récupérés
  console.log("Photographer Name Element:", photographerNameElement);
  console.log("Modal Overlay:", modalOverlay);
  console.log("Modal:", modal);
  console.log("Modal Header:", modalHeader);

  // Met à jour le contenu de la modal avec le nom du photographe
  if (modalOverlay && modal && modalHeader) {
    modalHeader.textContent = `Contactez ${photographerName}`;
    modalOverlay.style.display = "block";
    modal.style.display = "block";
  } else {
    console.log("Modal elements are null or undefined");
  }
}
// Fonction pour fermer la modale
function closeModal() {
  const modalOverlay = document.getElementById("modalOverlay");
  const modal = document.getElementById("modal");

  if (modalOverlay && modal) {
    modalOverlay.style.display = "none";
    modal.style.display = "none";
  }
}

// Fonction pour envoyer le message (console.log pour l'exemple)
function submitForm(event: Event): void {
  event.preventDefault();

  const firstName = (document.getElementById("firstName") as HTMLInputElement)
    .value;
  const lastName = (document.getElementById("lastName") as HTMLInputElement)
    .value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const message = (document.getElementById("message") as HTMLTextAreaElement)
    .value;

  console.log("Prénom:", firstName);
  console.log("Nom:", lastName);
  console.log("Email:", email);
  console.log("Message:", message);

  // Fermez la modal après la soumission du formulaire
  closeModal();
}

// Nouvelle fonction pour gérer le clic sur le tri
function handleSortClick() {
  const sortBy = "popularité";
  console.log("Sort By:", sortBy);
  sortImages(gallery, sortBy);
}

document.addEventListener("DOMContentLoaded", () => {
  main();
  console.log("Page chargée");

  // Initialise likesData si ce n'est pas déjà fait
  likesData = JSON.parse(localStorage.getItem("likesData") || "{}");

  // Initialise totalLikes à partir du stockage local ou à 0
  const totalLikes = parseInt(localStorage.getItem("totalLikes") || "0", 10);

  // Met à jour les likes dans likesData avec le totalLikes actuel
  likesData = { 0: totalLikes };

  // Affiche le totalLikes et le tarif par jour
  if (photographerId !== null && jsonData) {
    displayTotalLikesAndDailyRate(photographerId, jsonData.media);
  }
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", submitForm);
  }

  // Ajout un gestionnaire d'événement au bouton de tri
  const sortButton = document.getElementById("sortMenuButton");
  if (sortButton) {
    sortButton.addEventListener("click", handleSortClick);
  }

  // Ajout l'événement clic à document pour capturer les clics sur le bouton de tri
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.id === "sortMenuButton") {
      handleSortClick();
      // Empêche le clic de provoquer une navigation
      e.preventDefault();
    }
  });
});
