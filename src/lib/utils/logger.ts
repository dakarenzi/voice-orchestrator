
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

export const logger = {
  log: (level: LogLevel, message: string, data?: any) => {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };
    // In Cloudflare, console.log is captured by the logging system
    console.log(JSON.stringify(entry));
  },

  debug: (message: string, data?: any) => logger.log('debug', message, data),
  info: (message: string, data?: any) => logger.log('info', message, data),
  warn: (message: string, data?: any) => logger.log('warn', message, data),
  error: (message: string, data?: any) => logger.log('error', message, data),
};
