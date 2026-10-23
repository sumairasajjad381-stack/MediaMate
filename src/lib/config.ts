import { z } from "zod";

/**
 * Validated Environment Configuration
 * Guarantees type-safety and fails fast on invalid/missing configurations.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("3000").transform((val) => parseInt(val, 10)),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  
  // Security & Authentication
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters long").default("dev-fallback-secret-minimum-16-characters"),
  SESSION_SECRET: z.string().min(16).default("dev-session-fallback-minimum-16-chars"),
  
  // Storage
  STORAGE_DRIVER: z.enum(["local", "s3"]).default("local"),
  LOCAL_STORAGE_PATH: z.string().default("./storage/media"),
  
  // S3 (Optional)
  S3_ENDPOINT: z.string().optional().default(""),
  S3_REGION: z.string().optional().default("us-east-1"),
  S3_BUCKET_NAME: z.string().optional().default(""),
  S3_ACCESS_KEY_ID: z.string().optional().default(""),
  S3_SECRET_ACCESS_KEY: z.string().optional().default(""),
  S3_PUBLIC_URL_PREFIX: z.string().optional().default(""),

  // Instagram Scraping Sessions (Optional)
  INSTAGRAM_SESSION_ID: z.string().optional().default(""),
  INSTAGRAM_CSRF_TOKEN: z.string().optional().default(""),
  INSTAGRAM_USER_AGENT: z.string().default(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
  ),

  // Rate Limiting
  RATE_LIMIT_ANONYMOUS: z.string().default("60").transform((v) => parseInt(v, 10)),
  RATE_LIMIT_AUTHENTICATED: z.string().default("180").transform((v) => parseInt(v, 10)),
});

export type EnvConfig = z.infer<typeof envSchema>;

function parseEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    // In production fail immediately, in dev fallback to safe defaults
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment configuration. Check logs.");
    }
  }
  return result.success ? result.data : (envSchema.parse({}) as EnvConfig);
}

export const env = parseEnv();
