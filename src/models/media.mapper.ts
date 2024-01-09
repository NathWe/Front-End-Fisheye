import { Media } from "./media";

export class MediaMapper {
  static map(data: {
    id: number;
    photographerId: number;
    title: string;
    image: string;
    video?: string;
    likes: number;
    date: string;
    price: number;
  }): Media {
    // Logique pour créer un objet Media à partir des données
    return {
      id: data.id,
      photographerId: data.photographerId,
      title: data.title,
      image: data.image,
      video: data.video,
      url: data.video ? data.video : data.image,
      likes: data.likes,
      date: data.date,
      price: data.price,
      type: data.video ? "video" : "image",
    };
  }
}
