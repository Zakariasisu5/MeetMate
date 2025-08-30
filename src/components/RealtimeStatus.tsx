import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Server, Database, CheckCircle, XCircle } from 'lucide-react';
import syncService from '../services/sync';

interface RealtimeStatusProps {
  className?: string;
}

const RealtimeStatus: React.FC<RealtimeStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<{
    backend: boolean;
    firebase: boolean;
  }>({
    backend: false,
    firebase: false,
  });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      setIsChecking(true);
      try {
        const healthStatus = await syncService.healthCheck();
        setStatus(healthStatus);
      } catch (error) {
        console.error('Health check failed:', error);
        setStatus({ backend: false, firebase: false });
      } finally {
        setIsChecking(false);
      }
    };

    // Initial check
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = (isOnline: boolean) => {
    return isOnline ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <XCircle className="w-4 h-4" />
    );
  };

  const getConnectionIcon = (isOnline: boolean) => {
    return isOnline ? (
      <Wifi className="w-4 h-4" />
    ) : (
      <WifiOff className="w-4 h-4" />
    );
  };

  if (isChecking) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-muted-foreground">Checking connections...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 text-xs ${className}`}>
      {/* Backend Status */}
      <div className="flex items-center gap-1">
        <Server className="w-3 h-3" />
        <span className="text-muted-foreground">Backend:</span>
        <div className={`flex items-center gap-1 ${getStatusColor(status.backend)}`}>
          {getConnectionIcon(status.backend)}
          {getStatusIcon(status.backend)}
        </div>
      </div>

      {/* Firebase Status */}
      <div className="flex items-center gap-1">
        <Database className="w-3 h-3" />
        <span className="text-muted-foreground">Firebase:</span>
        <div className={`flex items-center gap-1 ${getStatusColor(status.firebase)}`}>
          {getConnectionIcon(status.firebase)}
          {getStatusIcon(status.firebase)}
        </div>
      </div>

      {/* Overall Status */}
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Real-time:</span>
        <div className={`flex items-center gap-1 ${getStatusColor(status.backend && status.firebase)}`}>
          {getConnectionIcon(status.backend && status.firebase)}
          {getStatusIcon(status.backend && status.firebase)}
        </div>
      </div>
    </div>
  );
};

export default RealtimeStatus;
