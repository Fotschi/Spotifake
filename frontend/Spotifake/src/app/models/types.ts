export interface User {
  id: string;
  username: string;
}

export interface Song {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
