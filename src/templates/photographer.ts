import { Photographer } from "../models/photographer";

export function photographerTemplate(data: Photographer) {
  const { name, id, portrait, city, country, tagline, price } = data;

  const picture = `assets/photographers/id_photos/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");

    //Ajout lien autour de l'image et du nom du photographe
    const link = document.createElement("a");
    link.setAttribute("href", `photographer.html?id=${id}`);
    link.classList.add("photographer-link");
    link.setAttribute("aria-label", `${name}`);

    // Ajouter l'image du photographe
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", `${name}'s portrait`); // Ajout d'une description pour l'accessibilité
    img.setAttribute("tabindex", "-1"); // Rend l'image non focusable
    img.classList.add("photographer-image");
    link.appendChild(img);

    // Ajouter le nom du photographe
    const h2 = document.createElement("h2");
    h2.textContent = name;
    link.appendChild(h2);

    article.appendChild(link);

    // Ajouter la ville et le pays du photographe
    const location = document.createElement("p");
    location.textContent = `${city}, ${country}`;
    location.classList.add("location");
    article.appendChild(location);

    // Ajouter le tagline du photographe
    const taglineElement = document.createElement("p");
    taglineElement.textContent = tagline;
    article.appendChild(taglineElement);

    // Ajouter le prix du photographe
    const priceElement = document.createElement("p");
    priceElement.textContent = `À partir de ${price} €`;
    priceElement.classList.add("priceElement");
    article.appendChild(priceElement);

    //Ajout évènement click sur article
    article.addEventListener("click", () => {
      // Afficher les données du photographe dans la console
      console.log("Photographe sélectionné :", { name, id });
      //Redirige vers la page individuelle du photographe
      window.location.href = `photographer.html?id=${id}`;
    });

    return article;
  }

  return { name, picture, getUserCardDOM, id };
}
