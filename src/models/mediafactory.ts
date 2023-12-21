export interface Media {
  id: number;
  photographerId: number;
  title: string;
  image: string;
  video?: string;
  likes: number;
  date: string;
  price: number;
  type: "image" | "video";
}

export class MediaFactory {
  static createMedia(data: {
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
    const media: Media = {
      id: data.id,
      photographerId: data.photographerId,
      title: data.title,
      image: data.image,
      video: data.video,
      likes: data.likes,
      date: data.date,
      price: data.price,
      type: data.video ? "video" : "image", // Ajoutez cette ligne
    };

    return media;
  }
}
