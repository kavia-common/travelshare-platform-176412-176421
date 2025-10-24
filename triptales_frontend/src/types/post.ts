export type PostImage = {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
};

export type PostTip = {
  text: string;
  author?: string;
};

export type Post = {
  _id?: string;
  id?: string;
  title: string;
  content?: string;
  images?: PostImage[];
  tags?: string[];
  locations?: string[];
  tips?: PostTip[];
  author?: string;
  status?: 'draft' | 'published';
  createdAt?: string;
  likedCount?: number;
  favorites?: string[];
};
