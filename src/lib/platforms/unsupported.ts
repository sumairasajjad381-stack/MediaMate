import { IPlatformAdapter, MediaInspectResult, PlatformType } from "./types";

export class RestrictedPlatformAdapter implements IPlatformAdapter {
  constructor(
    public platform: PlatformType,
    public platformName: string,
    private domains: string[],
    private reason: string
  ) {}

  matches(url: string): boolean {
    try {
      const host = new URL(url).hostname.toLowerCase();
      return this.domains.some((d) => host === d || host.endsWith("." + d));
    } catch {
      return false;
    }
  }

  async inspect(url: string): Promise<MediaInspectResult> {
    return {
      platform: this.platform,
      platformName: this.platformName,
      url,
      mediaType: "unknown",
      supportedActions: [],
      isSupported: false,
      limitationsNotice: this.reason,
      error: `${this.platformName} is not currently supported with permitted free-tier integrations.`,
    };
  }
}
