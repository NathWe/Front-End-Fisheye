import { Media } from "../models/media";
import { MediaFactory } from "../models/media.factory";

export class Lightbox {
  private static currentIndex: number = 0;
  private static mediaList: Media[] = [];
  private static mediaFactory: MediaFactory = new MediaFactory();
  private static modal: HTMLElement | null = null;
  private static overlay: HTMLElement | null = null;
  private static lightboxImage: HTMLElement | null = null;
  private static lightboxTitle: HTMLElement | null = null;
  private static closeLightboxIcon: HTMLElement | null = null;
  private static prevImageIcon: HTMLElement | null = null;
  private static nextImageIcon: HTMLElement | null = null;

  //Initialisation de la Lightbox avec les éléments du DOM
  static initialize(
    overlayId: string,
    lightboxId: string,
    lightboxImageId: string,
    lightboxTitleId: string,
    closeLightboxIconId: string,
    prevImageIconId: string,
    nextImageIconId: string
  ) {
    this.overlay = document.getElementById(overlayId);
    this.modal = document.getElementById(lightboxId);
    this.lightboxImage = document.getElementById(lightboxImageId);
    this.lightboxTitle = document.getElementById(lightboxTitleId);
    this.closeLightboxIcon = document.getElementById(closeLightboxIconId);
    this.prevImageIcon = document.getElementById(prevImageIconId);
    this.nextImageIcon = document.getElementById(nextImageIconId);

    if (
      this.overlay &&
      this.modal &&
      this.lightboxImage &&
      this.lightboxTitle &&
      this.closeLightboxIcon &&
      this.prevImageIcon &&
      this.nextImageIcon
    ) {
      // Événements pour les icônes et l'ouverture de la Lightbox
      this.closeLightboxIcon.addEventListener(
        "click",
        this.closeLightbox.bind(this)
      );
      this.prevImageIcon.addEventListener(
        "click",
        this.showPrevImage.bind(this)
      );
      this.nextImageIcon.addEventListener(
        "click",
        this.showNextImage.bind(this)
      );

      // Evénement click sur l'image pour ouvrir la lightbox
      this.lightboxImage.addEventListener("click", () => {
        console.log("Trying to open lightbox");
        this.openLightbox(this.mediaList, this.currentIndex);
      });
    } else {
      console.error("Lightbox elements are null or undefined");
    }
  }
  // Ouvre la Lightbox avec une liste de médias et un index de départ
  static openLightbox(mediaList: Media[], startIndex: number) {
    this.mediaList = mediaList;
    this.currentIndex = startIndex;

    console.log("Opening Lightbox with Media List:", this.mediaList);
    console.log("Media List Length:", this.mediaList.length);
    console.log("Starting at Index:", this.currentIndex);

    if (this.currentIndex < 0 || this.currentIndex >= this.mediaList.length) {
      console.error("Invalid start index:", this.currentIndex);
      return;
    }

    console.log("Current Index:", this.currentIndex);
    console.log("Media List:", this.mediaList);
    console.log("Overlay:", this.overlay);
    console.log("Modal:", this.modal);
    console.log("Lightbox Image:", this.lightboxImage);
    console.log("Lightbox Title:", this.lightboxTitle);

    this.updateLightboxContent();

    if (this.overlay && this.modal) {
      this.overlay.classList.add("open");
      this.modal.classList.add("open");
    } else {
      console.error("Overlay or Modal is null or undefined.");
    }
  }
  // Met à jour le contenu de la Lightbox avec le média actuel.
  private static updateLightboxContent() {
    if (
      !this.mediaList ||
      this.currentIndex < 0 ||
      this.currentIndex >= this.mediaList.length
    ) {
      console.error("Invalid media object or index.");
      return;
    }

    const currentMedia = this.mediaList[this.currentIndex];

    if (!this.lightboxImage) {
      console.error("Lightbox Image is null or undefined.");
      return;
    }

    const mediaElement = this.mediaFactory
      .createMedia(currentMedia)
      .createHtmlElement({ media: currentMedia });

    if (this.lightboxImage) {
      this.lightboxImage.remove();
      this.lightboxImage = mediaElement;

      this.lightboxImage.setAttribute("id", "lightboxImage");
      this.lightboxImage.setAttribute("class", "lightbox-image");

      this.modal
        ?.querySelector(".lightbox-content")
        ?.prepend(this.lightboxImage);
    }

    if (this.lightboxTitle) {
      this.lightboxTitle.textContent = currentMedia.title;
    }
  }
  // Ferme la Lightbox
  static closeLightbox() {
    if (this.modal) {
      this.modal.classList.remove("open");

      if (this.overlay) {
        this.overlay.classList.remove("open");
      }
    } else {
      console.error("Modal is null or undefined.");
    }
  }
  // Affiche l'image précédente dans la Lightbox
  static showPrevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateLightboxContent();
    }
  }
  // Affiche l'image suivante dans la Lightbox
  static showNextImage() {
    if (this.currentIndex < this.mediaList.length - 1) {
      this.currentIndex++;
      this.updateLightboxContent();
    }
  }
}
