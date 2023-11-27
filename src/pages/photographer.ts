import { photographerTemplate } from "../templates/photographer";
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

// Fonction pour afficher les détails du photographe
function displayPhotographerDetails(data: PhotographerData) {
  // Utiliser la fonction photographerTemplate pour générer le DOM
  const photographerModel = photographerTemplate(data);
  const mainElement = document.getElementById("main");

  if (mainElement) {
    mainElement.appendChild(photographerModel.getUserCardDOM());
  } else {
    console.error('Element "main" non trouvé.');
  }
}

// Appeler la fonction avec les données du photographe (à partir de la requête ou d'un autre moyen)
const photographerData: PhotographerData = {

    name: "Nom du photographe",
    id: 1,
    city: "Ville du photographe",
    country: "Pays du photographe",
    tagline: "Tagline du photographe",
    price: 500,
    portrait: "portrait.jpg",
};

displayPhotographerDetails(photographerData);

//Mettre le code TypeScript lié à la page photographer.html
