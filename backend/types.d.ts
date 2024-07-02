interface JwtPayload {
    userId: string;
    id: string
    email? : string
    // Add any other fields you want to extract from the token
  }