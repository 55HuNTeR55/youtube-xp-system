declare global {
  interface Window {
    gapi: {
      auth2: {
        getAuthInstance(): {
          signIn(): Promise<{
            getBasicProfile(): {
              getId(): string;
              getName(): string;
              getEmail(): string;
              getImageUrl(): string;
            };
          }>;
          signOut(): Promise<void>;
        };
      };
    };
  }
}

export {}; 