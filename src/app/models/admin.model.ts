/**
 * Modelos específicos para funcionalidades de Admin
 * Replica la estructura del backend Go (internal/models/admin_maintenance.go)
 */

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  mongo: {
    connected: boolean;
    responseTime?: number;
  };
  redis: {
    connected: boolean;
    responseTime?: number;
  };
  mlNodes: Array<{
    nodeId: string;
    address: string;
    status: 'online' | 'offline';
    responseTime?: number;
  }>;
  timestamp: string;
}

export interface CacheStats {
  keys: number;
  memoryUsage: number;
  hits: number;
  misses: number;
  hitRate: number;
}

export interface DatabaseStats {
  collections: Array<{
    name: string;
    documentCount: number;
    size: number;
  }>;
  totalSize: number;
  totalDocuments: number;
}

export interface MLNodeInfo {
  nodeId: string;
  address: string;
  status: 'online' | 'offline';
  shard?: number;
  lastHealthCheck?: string;
  requestsProcessed?: number;
  averageResponseTime?: number;
}

export interface MaintenanceAction {
  action: 'clear-cache' | 'recompute-similarities' | 'rebuild-index' | 'cleanup-old-data';
  target?: string;
  params?: Record<string, any>;
}

export interface MaintenanceResult {
  success: boolean;
  action: string;
  message: string;
  duration?: number;
  affectedRecords?: number;
  timestamp: string;
}
