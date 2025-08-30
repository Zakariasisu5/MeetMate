import { useEffect, useState } from 'react';
import { useConnections } from '../hooks/useConnections';

export function UseConnectionsExample({ userId }: { userId: string }) {
  const { sendConnectionRequest, respondToRequest, getConnections, listenToIncomingRequests } = useConnections();
  const [connections, setConnections] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  // Listen to accepted connections
  useEffect(() => {
    const unsub = getConnections(userId, setConnections);
    return () => unsub && unsub();
  }, [userId]);

  // Listen to incoming requests
  useEffect(() => {
    const unsub = listenToIncomingRequests(userId, setRequests);
    return () => unsub && unsub();
  }, [userId]);

  // Example send/accept/decline actions (replace with your UI logic)
  // sendConnectionRequest(userId, 'otherUserId');
  // respondToRequest('connectionId', 'accepted');

  return (
    <div>
      <h3>Accepted Connections</h3>
      <ul>
        {connections.map(conn => (
          <li key={conn.id}>{conn.sender?.displayName || conn.receiverId}</li>
        ))}
      </ul>
      <h3>Incoming Requests</h3>
      <ul>
        {requests.map(req => (
          <li key={req.id}>{req.sender?.displayName || req.senderId}</li>
        ))}
      </ul>
    </div>
  );
}
