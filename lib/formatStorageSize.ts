export const formatStorageSize = (sizeInKB: number) => {
  if (sizeInKB >= 1024 * 1024) {
    return `${(sizeInKB / (1024 * 1024)).toFixed(2)} GB`; // Converte KB para GB
  } else if (sizeInKB >= 1024) {
    return `${(sizeInKB / 1024).toFixed(2)} MB`; // Converte KB para MB
  } else {
    return `${sizeInKB.toFixed(2)} KB`; // Mantém em KB
  }
};
