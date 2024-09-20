export const formatStorageSize = (sizeInKB: number) => {
  if (sizeInKB >= 1024 * 1024) {
    return `${(sizeInKB / (1024 * 1024)).toFixed(2)} GB`;
  } else if (sizeInKB >= 1024) {
    return `${(sizeInKB / 1024).toFixed(2)} MB`;
  } else {
    return `${sizeInKB.toFixed(2)} KB`;
  }
};

  // Função para converter diferentes unidades de tamanho (KB, MB, GB) para KB
  export const convertToKB = (size: number, unit: string): number => {
    switch (unit) {
      case 'GB':
        return size * 1024 * 1024;
      case 'MB':
        return size * 1024;
      default:
        return size; // Assume que já está em KB
    }
  };