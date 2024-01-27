import { Media, MediaJSON } from "./media";

export class MediaMapper {
  static map(data: MediaJSON, mediaFolderName: string): Media {
    // Logique pour créer un objet Media à partir des données
    return {
      id: data.id,
      photographerId: data.photographerId,
      title: data.title,
      url: `assets/photographers/${mediaFolderName}/${
        data.video ? data.video : data.image
      }`,
      likes: data.likes,
      date: new Date(data.date),
      price: data.price,
      type: data.video ? "video" : "image",
    };
  }
}
