interface ContainerData {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  filesCount: number;
  files: {
    id: string;
  }[];
}
