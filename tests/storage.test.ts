import { describe, it, expect, afterAll } from "vitest";
import { LocalStorageDriver } from "@/lib/storage/local-driver";
import { Readable } from "stream";
import fs from "fs";
import path from "path";

describe("LocalStorageDriver", () => {
  const testDir = "./storage/test_media";
  const driver = new LocalStorageDriver(testDir);

  afterAll(() => {
    const fullTestDir = path.resolve(process.cwd(), testDir);
    if (fs.existsSync(fullTestDir)) {
      fs.rmSync(fullTestDir, { recursive: true, force: true });
    }
  });

  it("should stream and save file with SHA-256 calculation", async () => {
    const sampleData = Buffer.from("Hello Instagram Media Content Stream");
    const stream = Readable.from(sampleData);
    const filename = "test_item.txt";

    const result = await driver.saveFromStream(stream, filename, "text/plain");

    expect(result.storagePath).toBe(filename);
    expect(result.sizeBytes).toBe(sampleData.length);
    expect(result.checksumSha256).toHaveLength(64); // SHA-256 hex is 64 characters

    const exists = await driver.exists(filename);
    expect(exists).toBe(true);

    const deleted = await driver.delete(filename);
    expect(deleted).toBe(true);

    const existsAfterDelete = await driver.exists(filename);
    expect(existsAfterDelete).toBe(false);
  });
});
