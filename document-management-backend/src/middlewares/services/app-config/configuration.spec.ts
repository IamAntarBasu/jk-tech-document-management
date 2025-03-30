import { getConfig, AppEnv, parseIntSafe } from "./configuration";

describe("getConfig", () => {
  beforeEach(() => {
    process.env.PORT = "9000";
    process.env.ENV = "dev";
    process.env.JWT_EXPIRY = "24h";
    process.env.JWT_SECRET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5432";
    process.env.POSTGRES_USER = "postgres";
    process.env.POSTGRES_PASSWORD = "root";
    process.env.POSTGRES_DB = "dummyDatabase";
    process.env.REDIS_HOST = "localhost";
    process.env.REDIS_PORT = "6379";
    process.env.REDIS_PASSWORD = "antar";
    process.env.UPLOAD_PATH = "/uploaded-file-data";
    process.env.UPLOAD_MAX_FILE_SIZE = "5242880";
  });

  it("should return the correct configuration when all environment variables are set", () => {
    const config = getConfig();
    expect(config).toEqual({
      port: 9000,
      appEnv: AppEnv.DEV,
      jwt: {
        expiry: "24h",
        secret: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      },
      database: {
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "root",
        dbName: "dummyDatabase",
      },
      redis: {
        host: "localhost",
        port: 6379,
        password: "antar",
      },
      upload: {
        path: "/uploaded-file-data",
        maxFileSize: 5242880,
      },
    });
  });

  it("should use default values when environment variables are not set", () => {
    delete process.env.PORT;
    delete process.env.JWT_EXPIRY;
    delete process.env.DB_PORT;
    delete process.env.REDIS_PORT;
    delete process.env.UPLOAD_MAX_FILE_SIZE;

    const config = getConfig();
    expect(config.port).toBe(9000);
    expect(config.jwt.expiry).toBe("24h");
    expect(config.database.port).toBe(5432);
    expect(config.redis.port).toBe(6379);
    expect(config.upload.maxFileSize).toBe(1048576 * 5);
  });

  it("should handle missing optional environment variables", () => {
    delete process.env.JWT_SECRET;
    delete process.env.REDIS_PASSWORD;

    const config = getConfig();
    expect(config.jwt.secret).toBeUndefined();
    expect(config.redis.password).toBeUndefined();
  });

  describe("parseIntSafe", () => {
    it("should return fallback when num is undefined", () => {
      expect(parseIntSafe(undefined, 10)).toEqual(10);
    });

    it("should use the given num", () => {
      expect(parseIntSafe("10", 10)).toEqual(10);
    });

    it("should give fallback if provided num evaluates to NaN", () => {
      expect(parseIntSafe("abc", 10)).toEqual(10);
    });
  });
});
