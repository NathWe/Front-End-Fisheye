// urlUtils.ts

export function getPhotographerIdFromUrl(): number | null {
  const urlParams = new URLSearchParams(window.location.search);
  const photographerIdParam = urlParams.get("id");
  return photographerIdParam ? parseInt(photographerIdParam, 10) : null;
}
