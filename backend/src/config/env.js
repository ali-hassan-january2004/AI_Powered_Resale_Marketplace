
import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};

if (!env.mongodbUri) {
  throw new Error("MONGODB_URI is missing in .env");
}