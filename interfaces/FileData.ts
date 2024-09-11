export interface FileData {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  createdAt: string;
  url: string;
  containerId?: string; // ID do container, se existir
  containerName?: string; // Nome do container, se existir
}
