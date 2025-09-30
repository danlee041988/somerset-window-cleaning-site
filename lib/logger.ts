/**
 * Structured logging utility
 * Provides consistent, searchable logs with context
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  requestId?: string
  userId?: string
  action?: string
  duration?: number
  [key: string]: any
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const MIN_LOG_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info'

/**
 * Check if log level should be output
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LOG_LEVEL]
}

/**
 * Format log entry as JSON
 */
function formatLogEntry(level: LogLevel, message: string, context?: LogContext): string {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context && { context }),
  }

  // In production, output JSON for log aggregation
  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify(entry)
  }

  // In development, output human-readable format
  const contextStr = context ? ` ${JSON.stringify(context)}` : ''
  const requestIdStr = context?.requestId ? `[${context.requestId}] ` : ''
  return `${entry.timestamp} [${level.toUpperCase()}] ${requestIdStr}${message}${contextStr}`
}

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  if (!shouldLog(level)) {
    return
  }

  const formattedLog = formatLogEntry(level, message, context)

  switch (level) {
    case 'debug':
    case 'info':
      console.log(formattedLog)
      break
    case 'warn':
      console.warn(formattedLog)
      break
    case 'error':
      console.error(formattedLog)
      break
  }
}

/**
 * Logger instance with convenience methods
 */
export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),

  /**
   * Log with timing information
   */
  timed: (message: string, startTime: number, context?: LogContext) => {
    const duration = Date.now() - startTime
    log('info', message, { ...context, duration })
  },

  /**
   * Create a child logger with default context
   */
  child: (defaultContext: LogContext) => ({
    debug: (message: string, context?: LogContext) =>
      log('debug', message, { ...defaultContext, ...context }),
    info: (message: string, context?: LogContext) =>
      log('info', message, { ...defaultContext, ...context }),
    warn: (message: string, context?: LogContext) =>
      log('warn', message, { ...defaultContext, ...context }),
    error: (message: string, context?: LogContext) =>
      log('error', message, { ...defaultContext, ...context }),
  }),
}

/**
 * Performance timing helper
 */
export class Timer {
  private startTime: number

  constructor() {
    this.startTime = Date.now()
  }

  /**
   * Get elapsed time in milliseconds
   */
  elapsed(): number {
    return Date.now() - this.startTime
  }

  /**
   * Log with elapsed time
   */
  log(message: string, context?: LogContext): void {
    logger.timed(message, this.startTime, context)
  }

  /**
   * Reset timer
   */
  reset(): void {
    this.startTime = Date.now()
  }
}

/**
 * Create a timer instance
 */
export function createTimer(): Timer {
  return new Timer()
}
