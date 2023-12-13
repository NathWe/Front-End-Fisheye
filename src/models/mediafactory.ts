export interface Media {
  id: number;
  photographerId: number;
  title: string;
  image: string;
  likes: number;
  date: string;
  price: number;
}

export class MediaFactory {
  static createMedia(data: {
    id: number;
    photographerId: number;
    title: string;
    image: string;
    likes: number;
    date: string;
    price: number;
  }): Media {
    // logique pour créer un objet Media à partir des données
    return {
      id: data.id,
      photographerId: data.photographerId,
      title: data.title,
      image: data.image,
      likes: data.likes,
      date: data.date,
      price: data.price,
    };
  }
}
