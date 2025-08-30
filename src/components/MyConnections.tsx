import { useEffect, useState } from 'react';
import { getConnections } from '../services/api';

interface MyConnectionsProps {
  userId: string;
}

export function MyConnections({ userId }: MyConnectionsProps) {
  const [connections, setConnections] = useState<string[]>([]);
  useEffect(() => {
    getConnections(userId).then(res => setConnections(res.data.connections));
  }, [userId]);
  return (
    <div>
      <h3 className="font-semibold mb-2">My Connections</h3>
      <ul>
        {connections.length === 0 && <li>No connections yet.</li>}
        {connections.map(uid => <li key={uid}>{uid}</li>)}
      </ul>
    </div>
  );
}
