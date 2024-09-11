export interface DocumentData {
  id: string;
  containerId: string | null;
  userId: string;
  key: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  createdAt: string;
  container?: {
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
  } | null;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
  };
  signatures?: Array<{
    id: string;
    userId: string;
    fileId: string;
    signatureType: string;
    signedAt: string;
  }>;
}
