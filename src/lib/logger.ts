/**
 * Structured Logger
 * Emits JSON logs in production for Datadog/CloudWatch/ELK, and readable formatted logs in dev.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  userId?: string;
  ip?: string;
  requestId?: string;
  [key: string]: unknown;
}

class Logger {
  private isProd = process.env.NODE_ENV === "production";

  private formatMessage(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    if (this.isProd) {
      return JSON.stringify({
        timestamp,
        level: level.toUpperCase(),
        message,
        ...context,
      });
    }
    const ctxString = context && Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctxString}`;
  }

  debug(message: string, context?: LogContext): void {
    if (!this.isProd) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage("info", message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage("warn", message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errObj = error instanceof Error
      ? { errorName: error.name, errorMessage: error.message, stack: error.stack }
      : { rawError: error };

    console.error(
      this.formatMessage("error", message, {
        ...context,
        ...errObj,
      })
    );
  }
}

export const logger = new Logger();
