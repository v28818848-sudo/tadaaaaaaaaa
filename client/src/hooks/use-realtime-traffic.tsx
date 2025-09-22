import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface TrafficUpdate {
  location: string;
  queue: number;
  stopDensity: number;
  accidents: number;
  fatalities: number;
  congestionScore: number;
  congestionLevel: string;
  timestamp: string;
}

interface TrafficAlert {
  location: string;
  alert: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

interface WebSocketMessage {
  type: 'connection' | 'traffic_update' | 'traffic_alert';
  data?: TrafficUpdate[] | TrafficAlert;
  message?: string;
  timestamp: string;
}

export function useRealTimeTraffic() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [currentUpdates, setCurrentUpdates] = useState<TrafficUpdate[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<TrafficAlert[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Determine WebSocket URL
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    function connect() {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Connected to real-time traffic updates');
          setIsConnected(true);
          setConnectionError(null);
        };

        ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            
            switch (message.type) {
              case 'connection':
                console.log('WebSocket connection established:', message.message);
                break;
                
              case 'traffic_update':
                if (Array.isArray(message.data)) {
                  setCurrentUpdates(message.data);
                  setLastUpdate(message.timestamp);
                  
                  // Invalidate cache to show fresh data
                  queryClient.invalidateQueries({ queryKey: ['/api/indicators'] });
                }
                break;
                
              case 'traffic_alert':
                if (message.data && !Array.isArray(message.data)) {
                  setRecentAlerts(prev => {
                    const newAlerts = [message.data as TrafficAlert, ...prev.slice(0, 4)]; // Keep last 5 alerts
                    return newAlerts;
                  });
                }
                break;
                
              default:
                console.log('Unknown message type:', message.type);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed');
          setIsConnected(false);
          wsRef.current = null;
          
          // Attempt to reconnect after 5 seconds
          setTimeout(connect, 5000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionError('Connection failed');
          setIsConnected(false);
        };
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        setConnectionError('Failed to connect');
        setTimeout(connect, 5000);
      }
    }

    connect();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [queryClient]);

  const getTopCongestionAreas = () => {
    return currentUpdates
      .sort((a, b) => b.congestionScore - a.congestionScore)
      .slice(0, 5);
  };

  const getTotalLiveAccidents = () => {
    return currentUpdates.reduce((sum, update) => sum + update.accidents, 0);
  };

  return {
    isConnected,
    lastUpdate,
    currentUpdates,
    recentAlerts,
    connectionError,
    getTopCongestionAreas,
    getTotalLiveAccidents
  };
}