export interface Post {
  id: string;
  topic: string;
  content: string;
  status: "pending" | "approved" | "declined";
  decline_comment: string | null;
  version: number;
  source_doc_url: string | null;
  created_at: string;
  updated_at: string;
}
