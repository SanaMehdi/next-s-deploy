export type Audience = 'Public' | 'Friends'
export interface Profile { id: string; username: string | null; full_name: string | null; avatar_url: string | null }
export interface PostComment { id: string; post_id: string; user_id: string; content: string; created_at: string; user?: Profile }
export interface PostLike { post_id: string; user_id: string }
export interface PostRow {
  id: string; author_id: string; title: string | null; content: string | null; image_url?: string | null; audience: Audience; created_at: string;
  author?: Profile; comments?: PostComment[]; likes?: PostLike[]; comments_count?: number;
}
