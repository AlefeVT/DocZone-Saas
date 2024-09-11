export interface File {
  id: string;
  fileName: string;
}

export interface Container {
  id: string;
  name: string;
  description?: string | null;
  files: File[];
  children: Container[];
}
