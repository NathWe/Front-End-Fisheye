/*import { MediaFactory, Media } from '../models/mediafactory';
import * as data from '/Users/nathmallet/Desktop/FishEye/Front-End-Fisheye/public/data/photographer.json';

// Constantes pour les sélecteurs de classe
const SELECTOR_PHOTOGRAPHER_NAME = '.photographer-name';
const SELECTOR_LOCATION = '.location';
const SELECTOR_DESCRIPTION = '.description';
const SELECTOR_PHOTOGRAPHER_IMAGE = '.photographer-image';

// Fonction utilitaire pour obtenir un élément par sélecteur de classe
function getElementBySelector(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

// Fonction pour afficher les informations du photographe sur la page
function displayPhotographerInfo(photographer: any) {
    const photographerName = getElementBySelector(SELECTOR_PHOTOGRAPHER_NAME);
    const location = getElementBySelector(SELECTOR_LOCATION);
    const description = getElementBySelector(SELECTOR_DESCRIPTION);
    const photographerImage = getElementBySelector(SELECTOR_PHOTOGRAPHER_IMAGE);

    if (photographerName && location && description && photographerImage) {
        photographerName.textContent = photographer.name;
        location.textContent = `${photographer.city}, ${photographer.country}`;
        description.textContent = photographer.tagline;

        photographerImage.setAttribute('src', `assets/photographers/id_photos/${photographer.portrait}`);
        photographerImage.setAttribute('alt', photographer.name);
        photographerImage.classList.add('photographer-image');
    }
}

// Fonction principale pour la page du photographe
async function main(photographerData: any[], mediaData: any[]) {
    // Récupérer l'ID du photographe à partir de l'URL
    const photographerId = getPhotographerIdFromUrl();

    if (photographerId !== null) {
        // Trouver le photographe correspondant dans les données
        const photographer = photographerData.find((p) => p.id === photographerId);

        if (photographer) {
            // Afficher les informations du photographe
            displayPhotographerInfo(photographer);

            // Appeler la fonction pour afficher les réalisations du photographe
            displayPhotographerWork(photographerId, mediaData, photographerData);

            // Appeler la fonction pour afficher les détails du photographe
            await displayPhotographerInfo(photographer); // Assurez-vous que la fonction est asynchrone
        } else {
            console.error("Aucun photographe trouvé avec l'ID spécifié.");
        }
    } else {
        console.error("Aucun ID de photographe spécifié dans l'URL.");
    }
}

// Fonction pour afficher les réalisations d'un photographe
function displayPhotographerWork(photographerId: number, mediaData: any[], photographerData: any[]) {
  const mediaContainer = document.getElementById('media-container');

  if (!mediaContainer) {
    console.error("Media container not found in the document.");
    return;
  }

  // Filtrer les médias pour le photographe spécifique
  const photographerMedia = mediaData
    .filter((media) => media.photographerId === photographerId)
    .map((media) => MediaFactory.createMedia(media));

  // Afficher les médias dans le conteneur
  photographerMedia.forEach((media) => {
    const photographerFolderName = getPhotographerFolderName(photographerId, photographerData);
    const mediaElement = createMediaElement(media, photographerFolderName);
    mediaContainer.appendChild(mediaElement);
  });


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

// Fonction pour obtenir le nom du dossier du photographe en fonction de l'ID
function getPhotographerFolderName(photographerId: number, photographerData: any[]): string {
  const photographer = photographerData.find((p) => p.id === photographerId);

  // Retourner un nom par défaut ou générique si l'ID du photographe n'est pas trouvé
  return photographer ? photographer.portrait.replace('.jpg', '') : `photographer_${photographerId}`;
}

// Fonction pour obtenir l'ID du photographe à partir de l'URL
function getPhotographerIdFromUrl(): number | null {
  const urlParams = new URLSearchParams(window.location.search);
  const photographerIdParam = urlParams.get('id');
  return photographerIdParam ? parseInt(photographerIdParam, 10) : null;
}

const photographerData = data.photographers;
const mediaData = data.media;

// Appeler la fonction principale lors du chargement de la page
window.addEventListener('load', async () => await main(photographerData, mediaData));
*/