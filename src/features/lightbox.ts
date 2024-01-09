import { Media } from "../models/media";
import { MediaFactory, IHtmlMedia } from "../models/media.factory";

export class Lightbox {
  private static currentIndex: number = 0;
  private static mediaList: Media[] = [];
  private static mediaFactory: MediaFactory = new MediaFactory();
  private static modal: HTMLElement | null = null;
  private static lightboxImage: HTMLImageElement | null = null;
  private static lightboxTitle: HTMLElement | null = null;
  private static closeLightboxIcon: HTMLElement | null = null;
  private static prevImageIcon: HTMLElement | null = null;
  private static nextImageIcon: HTMLElement | null = null;

  static initialize(
    modalId: string,
    lightboxImageId: string,
    lightboxTitleId: string,
    closeLightboxIconId: string,
    prevImageIconId: string,
    nextImageIconId: string
  ) {
    this.modal = document.getElementById(modalId);
    this.lightboxImage = document.getElementById(
      lightboxImageId
    ) as HTMLImageElement;
    this.lightboxTitle = document.getElementById(lightboxTitleId);
    this.closeLightboxIcon = document.getElementById(closeLightboxIconId);
    this.prevImageIcon = document.getElementById(prevImageIconId);
    this.nextImageIcon = document.getElementById(nextImageIconId);

    console.log("Modal:", this.modal);
    console.log("Lightbox Image:", this.lightboxImage);
    console.log("Lightbox Title:", this.lightboxTitle);
    console.log("Close Lightbox Icon:", this.closeLightboxIcon);
    console.log("Prev Image Icon:", this.prevImageIcon);
    console.log("Next Image Icon:", this.nextImageIcon);

    if (
      this.modal &&
      this.lightboxImage &&
      this.lightboxTitle &&
      this.closeLightboxIcon &&
      this.prevImageIcon &&
      this.nextImageIcon
    ) {
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

      // Ajouter l'événement click sur l'image pour ouvrir la lightbox
      this.lightboxImage.addEventListener("click", () =>
        this.openLightbox(this.mediaList, this.currentIndex)
      );
    }
  }

  static openLightbox(mediaList: Media[], startIndex: number) {
    console.log("Opening Lightbox with Media List:", mediaList);
    console.log("Starting at Index:", startIndex);
    this.currentIndex = startIndex;
    this.mediaList = mediaList;

    this.updateLightboxContent();
    this.modal?.classList.add("open");
  }

  private static updateLightboxContent() {
    const currentMedia = this.mediaList[this.currentIndex];
    const src = `assets/photographers/id_photos/${currentMedia.url}`;
    const mediaElement = this.mediaFactory
      .createMedia(currentMedia)
      .createHtmlElement({ src, media: currentMedia });

    if (this.lightboxImage) {
      this.lightboxImage.src = src;
    }

    if (this.lightboxTitle) {
      this.lightboxTitle.textContent = currentMedia.title;
    }

    // Effacez tous les éléments enfants actuels de la modal avant d'ajouter le nouveau média
    while (this.modal?.firstChild) {
      this.modal?.removeChild(this.modal?.firstChild);
    }

    this.modal?.appendChild(mediaElement);
  }

  static closeLightbox() {
    this.modal?.classList.remove("open");

    // Effacez tous les éléments enfants actuels de la modal à la fermeture
    while (this.modal?.firstChild) {
      this.modal?.removeChild(this.modal?.firstChild);
    }
  }

  static showPrevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateLightboxContent();
    }
  }

  static showNextImage() {
    if (this.currentIndex < this.mediaList.length - 1) {
      this.currentIndex++;
      this.updateLightboxContent();
    }
  }
}
