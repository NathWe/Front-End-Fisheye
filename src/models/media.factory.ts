import { Media } from "./media";

// Interface définissant la méthode pour créer un élément HTML pour un média
export interface IHtmlMedia {
  createHtmlElement(options: { media: Media }): HTMLElement;
}

// Implémentation de l'interface pour créer un élément HTML pour une image
export class ImageMedia implements IHtmlMedia {
  createHtmlElement({ media }: { media: Media }): HTMLElement {
    // Crée un élément img
    const imgElement = document.createElement("img");
    // Attribue l'URL de l'image
    imgElement.src = media.url;
    // Attribue le titre de l'image comme texte alternatif
    imgElement.alt = media.title;
    // Ajoute une classe CSS à l'élément img
    imgElement.classList.add("media-image");

    // Retourne l'élément img créé
    return imgElement;
  }
}

// Implémentation de l'interface pour créer un élément HTML pour une vidéo
export class VideoMedia implements IHtmlMedia {
  createHtmlElement({ media }: { media: Media }): HTMLElement {
    // Crée un élément video
    const videoElement = document.createElement("video");
    // Active les contrôles de lecture pour la vidéo
    videoElement.controls = true;
    videoElement.width = 400;
    videoElement.height = 300;

    // Crée un élément source pour définir l'URL de la vidéo et le type de média
    const sourceElement = document.createElement("source");
    sourceElement.src = media.url;
    sourceElement.type = "video/mp4";

    // Ajoute l'élément source à l'élément video
    videoElement.appendChild(sourceElement);

    // Retourne l'élément video créé
    return videoElement;
  }
}

// Factory qui crée une instance de la classe appropriée en fonction du type de média
export class MediaFactory {
  createMedia(media: Media): IHtmlMedia {
    // Utilise une instruction switch pour choisir la classe appropriée en fonction du type de média
    switch (media.type) {
      case "image":
        return new ImageMedia();
      case "video":
        return new VideoMedia();
    }
  }
}
