declare module "#auth-utils" {
  interface User {
    name: string;
    email: string;
    avatar: string | null;
  }
}

export {};
