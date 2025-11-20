export const parsePhotos = (photosData) => {
  if (!photosData) return [];
  if (Array.isArray(photosData)) {
    return photosData.filter(Boolean);
  }
  if (typeof photosData === 'string') {
    try {
      const parsed = JSON.parse(photosData);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const getPrimaryPhoto = (photosData, fallbackUrl) => {
  const photos = parsePhotos(photosData);
  if (photos.length > 0 && photos[0]) {
    return photos[0];
  }
  return fallbackUrl || null;
};
