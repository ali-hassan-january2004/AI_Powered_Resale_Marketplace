export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const MOCK_PASSWORD = "password123";

export const MOCK_ACCOUNTS = [
  { role: "buyer", email: "ayesha@resale.test" },
  { role: "buyer", email: "bilal@resale.test" },
  { role: "seller", email: "sara@resale.test" },
  { role: "seller", email: "omar@resale.test" },
  { role: "admin", email: "admin@resale.test" },
];

const ACCESS = "mock-access.";
const REFRESH = "mock-refresh.";

// Fake tokens that just encode the user id (mock only, never do this in the real backend)
export const tokensFor = (user) => ({
  accessToken: `${ACCESS}${user._id}`,
  refreshToken: `${REFRESH}${user._id}`,
});

const idFrom = (token, prefix) => (token?.startsWith(prefix) ? token.slice(prefix.length) : null);

export const userFromRequest = (request, users) => {
  const header = request.headers.get("authorization") || "";
  const id = idFrom(header.replace(/^Bearer\s+/i, ""), ACCESS);
  return users.find((u) => u._id === id) || null;
};

export const userFromRefresh = (token, users) => {
  const id = idFrom(token, REFRESH);
  return users.find((u) => u._id === id) || null;
};

export const verifyPassword = (user, password) => user.password === password;

// Never send the password field to the client
export const publicUser = (user) => {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
};