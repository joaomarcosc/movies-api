export interface JwtPayload {
  sub: string;
  email: string;
}

export interface ValidatedUser {
  email: string;
  userId: string;
}
