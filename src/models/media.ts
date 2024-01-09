export interface Media {
  id: number;
  photographerId: number;
  title: string;
  // TODO: à supprimer
  image: string;
  // TODO: à supprimer
  video?: string;
  url: string;
  likes: number;
  date: string;
  price: number;
  type: "image" | "video";
}
