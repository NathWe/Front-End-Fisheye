// Importer la fonction photographerTemplate depuis le fichier de template
import { photographerTemplate } from "../templates/photographer";
import { Photographer } from "../models/photographer";
import "../styles/main.css";

// Définir un type pour les données du fichier JSON
export type PhotographerFetchResponse = {
  photographers: Photographer[];
};

// Fonction pour récupérer les données des photographes depuis le fichier JSON
async function getPhotographers(): Promise<PhotographerFetchResponse | null> {
  try {
    const response = await fetch("data/photographer.json");

    if (!response.ok) {
      throw new Error(
        `Erreur de chargement des données: ${response.statusText}`
      );
    }

    const data: PhotographerFetchResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur de chargement des données:", error);
    return null;
  }
}
// Fonction pour afficher les données des photographes
async function displayData(photographers: Photographer[]) {
  const photographersSection = document.querySelector(".photographer_section");

  if (!photographersSection) {
    console.error("Section des photographes non trouvée.");
    return;
  }

  photographers.forEach((photographer) => {
    // Utiliser la fonction photographerTemplate pour générer le DOM
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

// Fonction d'initialisation
async function init() {
  // Récupérer les données des photographes
  const photographersData = await getPhotographers();

  if (photographersData) {
    const { photographers } = photographersData;
    // Afficher les données des photographes
    displayData(photographers);
  }
}

// Appeler la fonction d'initialisation
init();
