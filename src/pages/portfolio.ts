import { MediaFactory } from "../models/media.factory";
import { MediaMapper } from "../models/media.mapper";
import { Media, MediaJSON } from "../models/media";
import { sortSelector } from "../features/sortSelector";
import { sortKey } from "../models/sort";
import { Lightbox } from "../features/lightbox";
import { getPhotographerIdFromUrl } from "../utils/urlUtils";

//variables globales
let photographerId: number | null;
let likesData: { [key: number]: number };
let jsonData: { photographers: Photographer[]; media: MediaJSON[] };
let rateValueElement: HTMLElement | null;
let mediaList: Media[];

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

function loadLikesData(photographerId: number, mediaData: Media[]) {
  likesData = JSON.parse(
    localStorage.getItem(`likesData_${photographerId}`) || "{}"
  );

  // Si rien dans le localstorage, on initialise les données de likes avec les données du fichier JSON
  if (Object.keys(likesData).length === 0) {
    mediaData
      .filter((media) => media.photographerId === photographerId)
      .forEach((media) => (likesData[media.id] = media.likes));
  }
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

    if (!photographerId) {
      console.error("Aucun ID de photographe spécifié dans l'URL.");
      return;
    }

    // Récupère la liste des médias du photographe
    mediaList = jsonData.media
      .filter((media) => media.photographerId === photographerId)
      .map((mediaJson) =>
        MediaMapper.map(
          mediaJson,
          getPhotographerFolderName(photographerId || 0, jsonData.photographers)
        )
      );

    sortSelector((selectedSortKey) => {
      // Faire quelque chose avec la valeur, quand l'utilisateur a fait une sélection
      if (selectedSortKey !== null) {
        // Mettre à jour la valeur de tri courante
        // Recharge les photos avec la nouvelle valeur de tri
        displayPhotographerWork(
          photographerId || 0,
          mediaList,
          selectedSortKey
        );
      }
    });

    // Charge les données de likes depuis le stockage local
    loadLikesData(photographerId, mediaList);
    console.log("LikesData :", likesData);

    // Calcule le nombre total de likes initial
    const initialTotalLikes = computeTotalLikes();

    // Affiche le nombre total de likes initial
    const totalLikesCountElement = getElementBySelector("#likes-count");
    if (totalLikesCountElement) {
      totalLikesCountElement.textContent = initialTotalLikes.toString();
    }

    // Trouve le photographe correspondant dans les données
    const photographer = jsonData.photographers.find(
      (p) => p.id === photographerId
    );

    if (!photographer) {
      console.error("Aucun photographe trouvé avec l'ID spécifié.");
      return;
    }
    // Afficher les informations du photographe dans le HTML
    const photographerNameElement = document.querySelector(
      ".photographer-name"
    ) as HTMLElement;
    const locationElement = document.querySelector(".location") as HTMLElement;
    const descriptionElement = document.querySelector(
      ".description"
    ) as HTMLElement;
    const photographerImageElement = document.getElementById(
      "photographerImage"
    ) as HTMLImageElement;

    // Mise à jour du contenu des éléments avec les données du photographe
    if (photographerNameElement) {
      photographerNameElement.textContent = photographer.name;
    }
    // Mise à jour du contenu de l'élément avec la localisation du photographe
    if (locationElement) {
      locationElement.textContent = `${photographer.city}, ${photographer.country}`;
    }
    // Mise à jour du contenu de l'élément avec la description du photographe
    if (descriptionElement) {
      descriptionElement.textContent = photographer.tagline;
    }
    // Mise à jour de l'attribut src de l'image avec le chemin de l'image du photographe
    if (photographerImageElement && photographer.portrait) {
      const imagePath = `assets/photographers/id_photos/${photographer.portrait}`;
      photographerImageElement.src = imagePath;
    }

    console.log("Photographe trouvé :", photographer);
    // Appelle la fonction pour afficher les réalisations du photographe
    displayPhotographerWork(photographerId, mediaList);

    // Appelle la fonction pour afficher le nombre total de likes et le tarif par jour
    displayTotalLikesAndDailyRate(photographerId, mediaList);
  } catch (error) {
    console.error("Une erreur est survenue :", error);
  }

  document
    .getElementById("contactForm")
    ?.addEventListener("submit", submitForm);

  document
    .querySelector("#media-container")
    ?.addEventListener("click", (event) => {
      console.log(event.target);
    });

  // Ajout d'un gestionnaire d'événement au bouton "Contactez-moi"
  const openContactModalButton = document.getElementById(
    "openContactModalButton"
  );
  openContactModalButton?.addEventListener("click", () => {
    openContactModal();
  });

  // Ajout d'un gestionnaire d'événement pour la touche "Escape" sur la croix de fermeture du formulaire
  const closeModalIcon = document.getElementById("closeModalIcon");
  closeModalIcon?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  closeModalIcon?.addEventListener("blur", () => {
    // Supprimer l'écouteur d'événements pour la touche "Escape"
    document.removeEventListener("keydown", escapeKeyHandler);
  });
}

function escapeKeyHandler(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeModal();
  }
}

// Fonction pour afficher les réalisations d'un photographe
function displayPhotographerWork(
  photographerId: number,
  mediaData: Media[],
  sortBy: sortKey = "popular"
) {
  // affiche les réalisations du photographe sur la page
  const mediaContainer = document.querySelector(SELECTOR_MEDIA_CONTAINER);

  if (!mediaContainer) {
    console.error("Media container not found in the document.");
    return;
  }

  // Vide le conteneur avant d'ajouter les nouveaux éléments
  mediaContainer.innerHTML = "";

  console.log("Media container found:", mediaContainer);

  const photographerMedia = mediaData.filter(
    (media) => media.photographerId === photographerId
  );

  console.log("Photographer media:", photographerMedia);

  // Tri des datas pour les afficher dans le bon ordre
  // Utilise la fonction sortImages pour trier les images avant de les afficher
  const sortedPhotographerMedia = sortImages(photographerMedia, sortBy);

  sortedPhotographerMedia.forEach((media) => {
    // Vérifie si la propriété 'url' est définie dans l'objet média
    if (!media.url) {
      console.error("Media object is missing 'url' property:", media);
      return;
    }

    const mediaElement = createMediaElement(media);

    console.log("Media element created:", mediaElement);

    // Initialise le nombre de likes au moment de la création de l'élément média
    const likesCountElement = mediaElement.querySelector(".likes p");
    if (likesCountElement) {
      // Utilise une variable pour stocker le nombre total de likes au chargement de la page
      likesCountElement.textContent = (likesData[media.id] || 0).toString();
    }

    // Ajoute un gestionnaire de clic sur le cœur pour chaque élément média
    const heartIcon = mediaElement.querySelector(".likes span");
    if (heartIcon) {
      heartIcon.addEventListener("click", () => handleLikeClick(media.id));
    }

    mediaContainer.appendChild(mediaElement);
  });

  console.log("Media elements added to media container.");
}

// Fonction pour créer un élément HTML pour un média
function createMediaElement(media: Media): HTMLElement {
  const htmlMediaElement = new MediaFactory()
    .createMedia(media)
    .createHtmlElement({
      media,
    });

  const mediaElement = document.createElement("div");
  mediaElement.classList.add("media-item");

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
  likesNumberElement.textContent = (likesData[media.id] || 0).toString();
  likesElement.appendChild(likesNumberElement);

  const heartElement = document.createElement("span");
  heartElement.textContent = "❤";
  likesElement.appendChild(heartElement);

  mediaDetails.appendChild(titleElement);
  mediaDetails.appendChild(likesElement);

  mediaDetailsContainer.appendChild(mediaDetails);
  mediaElement.appendChild(htmlMediaElement);
  mediaElement.appendChild(mediaDetailsContainer);

  // Ajout d'un attribut tabindex à l'élément d'image
  if (media.type === "image") {
    const imageElement = mediaElement.querySelector("img");
    if (imageElement) {
      imageElement.alt = media.title;
      imageElement.setAttribute("tabindex", "0");

      // Ajoutez un gestionnaire d'événements pour la touche "Entrée"
      imageElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          // Ouvrez la lightbox avec l'image ou la vidéo correspondante
          const startIndex = mediaList.findIndex(
            (mediaItem) => mediaItem.url === media.url
          );

          if (startIndex !== -1) {
            if (
              !document.getElementById("lightbox")?.classList.contains("open")
            ) {
              Lightbox.openLightbox(mediaList, startIndex);
            }
          }
        }
      });
    }
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

function handleLikeClick(mediaId: number): void {
  console.log(`Clic sur le cœur détecté pour la photo ${mediaId}`);

  if (!photographerId) return;

  // Initialise likesData si ce n'est pas déjà fait
  likesData[mediaId] = likesData[mediaId] || 0;

  // Avant l'incrémentation
  console.log("Avant l'incrémentation : ", likesData[mediaId]);

  // Incrémente le nombre de likes pour la photo spécifique
  likesData[mediaId]++;

  // Après l'incrémentation
  console.log("Après l'incrémentation : ", likesData[mediaId]);

  // Mise à jour compteur like du media
  const likesCountElement = document.querySelector(
    `[data-media-id="${mediaId}"]`
  );
  if (likesCountElement)
    likesCountElement.textContent = likesData[mediaId].toString();

  // Recalcule le nombre total de likes et met à jour l'affichage
  displayTotalLikesAndDailyRate(photographerId, mediaList);
  console.log(`Likes mis à jour pour la photo ${mediaId}`);

  // Sauvegarde les données de likes dans le stockage local
  localStorage.setItem(
    `likesData_${photographerId}`,
    JSON.stringify(likesData)
  );
}

// Fonction pour calculer le nombre total de likes
function computeTotalLikes(): number {
  return Object.values(likesData).reduce((sum, likes) => sum + likes, 0);
}

// Fonction pour afficher le nombre total de likes et le tarif par jour
function displayTotalLikesAndDailyRate(
  photographerId: number,
  mediaData: Media[]
): void {
  if (!photographerId) return;

  const totalLikesCountElement = getElementBySelector("#likes-count");
  if (!totalLikesCountElement) return;

  // Affiche le nombre total de likes
  totalLikesCountElement.textContent = computeTotalLikes().toString();

  // Affiche le tarif par jour
  if (rateValueElement) {
    rateValueElement.textContent = getDailyRate(
      photographerId,
      mediaData
    ).toString();
  }
}

// Fonction pour trier les images en fonction de l'option sélectionnée
function sortImages(gallery: Media[], sortBy: sortKey) {
  console.log("Sorting images by:", sortBy);
  switch (sortBy) {
    case "popular":
      gallery.sort((a, b) => b.likes - a.likes);
      break;
    case "date":
      gallery.sort((a, b) => b.date.getTime() - a.date.getTime());
      break;
    case "title":
      gallery.sort((a, b) =>
        a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
      );
      break;
    default:
      break;
  }

  console.log("Sorted gallery:", gallery);
  // Retourne les images triées
  return gallery;
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
  const closeModalFunction = closeModal;

  // logs pour voir si les éléments sont correctement récupérés
  console.log("Photographer Name Element:", photographerNameElement);
  console.log("Modal Overlay:", modalOverlay);
  console.log("Modal:", modal);
  console.log("Modal Header:", modalHeader);
  console.log("Close Modal Function:", closeModalFunction);

  // Met à jour le contenu de la modal avec le nom du photographe
  if (modalOverlay && modal && modalHeader) {
    modalHeader.textContent = `${photographerName}`;
    modalOverlay.style.display = "block";
    modal.style.display = "block";
    // Ajoute un gestionnaire d'événement au bouton de fermeture dans ce contexte
    const closeModalIcon = document.getElementById("closeModalIcon");
    closeModalIcon?.addEventListener("click", closeModalFunction);
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

document.addEventListener("DOMContentLoaded", () => {
  main();
  console.log("Page chargée");
  rateValueElement = getElementBySelector("#rate-value");

  // Affiche le totalLikes et le tarif par jour
  if (photographerId !== null && jsonData) {
    displayTotalLikesAndDailyRate(photographerId, mediaList);
  }
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", submitForm);
  }

  //lightbox

  //Initialisation de la lightbox

  Lightbox.initialize(
    "lightboxOverlay",
    "lightbox",
    "lightboxImage",
    "lightboxTitle",
    "closeLightbox",
    "prevImage",
    "nextImage"
  );
});

// Gestionnaire d'événement pour les touches au clavier
document.addEventListener("keydown", (event) => {
  // Si la lightbox est ouverte
  if (document.getElementById("lightbox")?.classList.contains("open")) {
    switch (event.key) {
      case "ArrowLeft":
        // passer à l'image précédente
        Lightbox.showPrevImage();
        break;
      case "ArrowRight":
        // passer à l'image suivante
        Lightbox.showNextImage();
        break;
      case "Escape":
        // fermer la lightbox
        if (Lightbox) {
          Lightbox.closeLightbox();
        }
        break;
    }
  }
});

document
  .querySelector("#media-container")
  ?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    // Vérifie si l'élément cliqué est une image
    if (target.tagName === "IMG") {
      console.log("Image cliquée!");

      // Trouve l'index de l'image cliquée dans la liste des médias
      const startIndex = mediaList.findIndex(
        (media) => media.url === target.getAttribute("src")
      );

      console.log(startIndex);

      // Vérifie si l'index a été trouvé
      if (startIndex !== -1) {
        // La ligne suivante ouvre la lightbox uniquement si elle n'est pas déjà ouverte
        if (!document.getElementById("lightbox")?.classList.contains("open")) {
          Lightbox.openLightbox(mediaList, startIndex);
        }
      }
    }
  });
