
export type Notice = {
  id: string;
  title: string;
  content: string | null;
  file_url: string | null;
  created_at: string;
  updated_at: string;
  published: boolean;
};
