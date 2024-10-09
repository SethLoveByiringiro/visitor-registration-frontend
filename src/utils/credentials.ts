// src/utils/credentials.ts

interface Credential {
  username: string;
  password: string;
}

export const RECEPTIONIST_CREDENTIALS: Credential[] = [
  { username: "moh-admin", password: "admin@2024" },
  // You can add more credentials here if needed in the future
];

export const validateCredentials = (
  username: string,
  password: string
): boolean => {
  return RECEPTIONIST_CREDENTIALS.some(
    (cred) => cred.username === username && cred.password === password
  );
};
