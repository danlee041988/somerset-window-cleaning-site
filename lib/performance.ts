/**
 * Performance monitoring utilities
 * Track and report performance metrics
 */

import { logger } from './logger'

export interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count'
  timestamp: number
  context?: Record<string, any>
}

const metrics: PerformanceMetric[] = []
const MAX_METRICS = 1000 // Prevent memory leak

/**
 * Record a performance metric
 */
export function recordMetric(
  name: string,
  value: number,
  unit: 'ms' | 'bytes' | 'count' = 'ms',
  context?: Record<string, any>
): void {
  const metric: PerformanceMetric = {
    name,
    value,
    unit,
    timestamp: Date.now(),
    context,
  }

  metrics.push(metric)

  // Prevent unbounded growth
  if (metrics.length > MAX_METRICS) {
    metrics.shift()
  }

  // Log significant metrics
  if (unit === 'ms' && value > 1000) {
    logger.warn(`Slow operation: ${name}`, {
      duration: value,
      ...context,
    })
  }
}

/**
 * Get all recorded metrics
 */
export function getMetrics(): PerformanceMetric[] {
  return [...metrics]
}

/**
 * Get metrics by name
 */
export function getMetricsByName(name: string): PerformanceMetric[] {
  return metrics.filter((m) => m.name === name)
}

/**
 * Calculate average for a metric
 */
export function getAverageMetric(name: string): number | null {
  const metricValues = metrics.filter((m) => m.name === name).map((m) => m.value)

  if (metricValues.length === 0) {
    return null
  }

  return metricValues.reduce((sum, val) => sum + val, 0) / metricValues.length
}

/**
 * Clear all metrics
 */
export function clearMetrics(): void {
  metrics.length = 0
}

/**
 * Measure execution time of a function
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  const start = Date.now()

  try {
    const result = await fn()
    const duration = Date.now() - start

    recordMetric(name, duration, 'ms', context)

    return result
  } catch (error) {
    const duration = Date.now() - start
    recordMetric(name, duration, 'ms', { ...context, error: true })
    throw error
  }
}

/**
 * Measure execution time of a synchronous function
 */
export function measure<T>(
  name: string,
  fn: () => T,
  context?: Record<string, any>
): T {
  const start = Date.now()

  try {
    const result = fn()
    const duration = Date.now() - start

    recordMetric(name, duration, 'ms', context)

    return result
  } catch (error) {
    const duration = Date.now() - start
    recordMetric(name, duration, 'ms', { ...context, error: true })
    throw error
  }
}

/**
 * Performance monitoring for API routes
 */
export class RoutePerformance {
  private route: string
  private startTime: number
  private metrics: Map<string, number>

  constructor(route: string) {
    this.route = route
    this.startTime = Date.now()
    this.metrics = new Map()
  }

  /**
   * Mark a checkpoint
   */
  mark(name: string): void {
    this.metrics.set(name, Date.now() - this.startTime)
  }

  /**
   * Complete and record all metrics
   */
  complete(statusCode: number): void {
    const totalDuration = Date.now() - this.startTime

    recordMetric(`route:${this.route}`, totalDuration, 'ms', {
      statusCode,
      checkpoints: Object.fromEntries(this.metrics),
    })

    // Log slow routes
    if (totalDuration > 2000) {
      logger.warn(`Slow route: ${this.route}`, {
        duration: totalDuration,
        statusCode,
        checkpoints: Object.fromEntries(this.metrics),
      })
    }
  }
}

/**
 * Get performance summary
 */
export function getPerformanceSummary(): {
  totalMetrics: number
  slowOperations: number
  averages: Record<string, number>
} {
  const uniqueNames = [...new Set(metrics.map((m) => m.name))]
  const averages: Record<string, number> = {}

  uniqueNames.forEach((name) => {
    const avg = getAverageMetric(name)
    if (avg !== null) {
      averages[name] = Math.round(avg)
    }
  })

  const slowOperations = metrics.filter((m) => m.unit === 'ms' && m.value > 1000).length

  return {
    totalMetrics: metrics.length,
    slowOperations,
    averages,
  }
}
