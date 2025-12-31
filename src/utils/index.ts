export const generateUsername = (): string => {
  const usernamePrefix = 'user-';
  const randomChars = Math.random().toString(36).substring(2, 10);

  const username = usernamePrefix + randomChars;
  return username;
};
