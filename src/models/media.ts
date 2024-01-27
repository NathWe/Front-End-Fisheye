export type MediaJSON = {
  id: number;
  photographerId: number;
  title: string;
  image?: string;
  video?: string;
  likes: number;
  date: string;
  price: number;
};

export type Media = Omit<MediaJSON, "image" | "video" | "date"> & {
  date: Date;
  url: string;
  type: "image" | "video";
};
