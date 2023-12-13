import { photographerTemplate } from "../templates/photographer";
import { Photographer } from "../models/photographer";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Media } from "../models/mediafactory";
import "../styles/main.css";
import "../styles/photographer.css";

type PhotographerData = {
  // Ajoutez ici les propriétés spécifiques du photographe
  name: string;
  id: number;
  city: string;
  country: string;
  tagline: string;
  price: number;
  portrait: string;
};
type PhotographerWithMedia = Photographer & { media: Media[] };

// Fonction pour récupérer les détails du photographe par son ID
async function getPhotographerById(photographerId: number): Promise<PhotographerWithMedia | null> {
  try {
    const response = await fetch("data/photographer.json");

    if (!response.ok) {
      throw new Error(`Erreur de chargement des données: ${response.statusText}`);
    }

    const data: { photographers: Photographer[]; media: Media[] } = await response.json();
    const photographer = data.photographers.find((p) => p.id === photographerId);

    if (photographer) {
      const photographerWithMedia: PhotographerWithMedia = {
        ...photographer,
        media: data.media.filter((m) => m.photographerId === photographerId),
      };

      return photographerWithMedia;
    }

    return null;
  } catch (error) {
    console.error("Erreur de chargement des données:", error);
    return null;
  }
}


// Fonction pour afficher les détails du photographe
function displayPhotographerDetails(data: PhotographerData, mediaData: Media[]) {
  // Utiliser la fonction photographerTemplate pour générer le DOM
  const photographerModel = photographerTemplate(data);

  // Récupérer le conteneur pour les réalisations du photographe
  const mediaContainer = document.getElementById("media-container");

  if (!mediaContainer) {
    console.error('Element "media-container" non trouvé.');
    return;
  }

  // Filtrer les médias pour le photographe spécifique
  const photographerMedia = mediaData.filter((media) => media.photographerId === data.id);

  // Afficher les médias dans le conteneur
  photographerMedia.forEach((media) => {
    const mediaElement = createMediaElement(media, "mediafactory.ts");
    mediaContainer.appendChild(mediaElement);
  });

  // Ajouter le modèle du photographe
  const mainElement = document.getElementById("main");
  if (mainElement) {
    mainElement.appendChild(photographerModel.getUserCardDOM());
  } else {
    console.error('Element "main" non trouvé.');
  }
}

// Fonction pour créer un élément HTML pour un média
function createMediaElement(media: Media, photographerFolderName: string): HTMLElement {
  const mediaElement = document.createElement('div');
  mediaElement.classList.add('media-item');

  // Créer la structure HTML en utilisant les informations du média
  const mediaHTML = `
    <img src="assets/photographers/${photographerFolderName}/${media.image}" alt="${media.title}">
    <div class="media-details">
      <h3>${media.title}</h3>
      <p>${media.likes} Likes</p>
    </div>
  `;

  mediaElement.innerHTML = mediaHTML;

  return mediaElement;
}

// Récupérer l'ID du photographe depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const photographerId = parseInt(urlParams.get("id") || "0", 10);

// Appeler la fonction pour obtenir les données du photographe
async function init() {
  const photographerData = await getPhotographerById(photographerId);

  // Appeler la fonction pour afficher les données du photographe
  if (photographerData) {
    // Afficher les détails du photographe avec ses réalisations
    displayPhotographerDetails(photographerData, photographerData.media);
  }
}

// Appeler la fonction principale lors du chargement de la page
window.addEventListener("load", init);


const openContactModalButton = document.getElementById("openContactModalButton");
const contactModal = document.getElementById("contact_modal");

if (openContactModalButton && contactModal) {
  openContactModalButton.addEventListener("click", () => openContactModal(contactModal));
}
const formElement = document.getElementById("contact_modal");

// Vérifier si l'élément du formulaire existe
if (formElement) {
  // Ajouter un gestionnaire d'événements pour le formulaire
  formElement.addEventListener("submit", submitForm);
}
function openContactModal(modal: HTMLElement) {
  // Ouvrir la modale
  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "true");
  // Gérer le focus pour des raisons d'accessibilité
  modal.focus();
}

// Fonction pour fermer la modale
function closeModal() {
  const contactModal = document.getElementById("contact_modal");
  if (contactModal) {
    // Fermer la modale
    contactModal.style.display = "none";
    contactModal.setAttribute("aria-hidden", "false");
  }
}

// Fonction pour soumettre le formulaire
function submitForm(event: Event) {
  event.preventDefault();
  // Code pour traiter les données du formulaire


  // Fermer la modale après avoir traité les données
  closeModal();
}