import { env } from "../config";
import { IStorageDriver } from "./driver.interface";
import { LocalStorageDriver } from "./local-driver";
import { S3StorageDriver } from "./s3-driver";

/**
 * Storage Driver Singleton Factory
 * Defaults to LocalStorageDriver for immediate zero-config development,
 * switches to S3StorageDriver when STORAGE_DRIVER=s3.
 */
let storageInstance: IStorageDriver | null = null;

export function getStorageDriver(): IStorageDriver {
  if (!storageInstance) {
    if (env.STORAGE_DRIVER === "s3") {
      storageInstance = new S3StorageDriver();
    } else {
      storageInstance = new LocalStorageDriver(env.LOCAL_STORAGE_PATH);
    }
  }
  return storageInstance;
}
