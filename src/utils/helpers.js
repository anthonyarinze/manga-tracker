export const formatFavorites = (favorites) => {
  if (favorites >= 1e6) {
    return (favorites / 1e6).toFixed(1) + "m";
  } else if (favorites >= 1e3) {
    return (favorites / 1e3).toFixed(1) + "k";
  } else {
    return favorites.toString();
  }
};

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
