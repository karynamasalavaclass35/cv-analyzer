export type Role = {
  id: string;
  name: string;
  description: string;
  fitScore?: number; // undefined when the role is not yet analysed
  createdAt?: string; // timestamp, undefined when the role is not yet analysed
};

export type CV = {
  id: string;
  fileName: string;
  url: string;
  downloadUrl: string;
  createdAt: string; // timestamp
  roles: Role[];
};

export type Analysis = {
  applicant: string;
  role: string;
  requirements: string;
  fitScore: number;
};
