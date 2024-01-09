import { Media } from "./media";

export interface IHtmlMedia {
  createHtmlElement(options: { src: string; media: Media }): HTMLElement;
}

export class ImageMedia implements IHtmlMedia {
  createHtmlElement({
    src,
    media,
  }: {
    src: string;
    media: Media;
  }): HTMLElement {
    const imgElement = document.createElement("img");
    imgElement.src = src;
    imgElement.alt = media.title;
    imgElement.classList.add("media-image");

    return imgElement;
  }
}

export class VideoMedia implements IHtmlMedia {
  createHtmlElement({ src }: { src: string; media: Media }): HTMLElement {
    const videoElement = document.createElement("video");
    videoElement.controls = true;
    videoElement.width = 400;
    videoElement.height = 300;

    const sourceElement = document.createElement("source");
    sourceElement.src = src;
    sourceElement.type = "video/mp4";

    videoElement.appendChild(sourceElement);

    return videoElement;
  }
}

export class MediaFactory {
  createMedia(media: Media): IHtmlMedia {
    switch (media.type) {
      case "image":
        return new ImageMedia();
      case "video":
        return new VideoMedia();
    }
  }
}
