import { useEffect, useState } from 'react';
import { respondToConnection } from '../services/api';
import axios from 'axios';

interface PendingRequestsProps {
  userId: string;
}

export function PendingRequests({ userId }: PendingRequestsProps) {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/connections/pending/${userId}`).then(res => {
      setPending(res.data.requests);
      setLoading(false);
    });
  }, [userId]);

  const handleRespond = async (connectionId: string, status: 'accepted' | 'declined') => {
    await respondToConnection(connectionId, status);
    setPending(pending.filter(r => r.id !== connectionId));
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h3 className="font-semibold mb-2">Pending Requests</h3>
      {pending.length === 0 && <div>No pending requests.</div>}
      {pending.map(req => (
        <div key={req.id} className="flex items-center space-x-2 mb-2">
          <span>{req.senderName}</span>
          <button onClick={() => handleRespond(req.id, 'accepted')} className="btn-primary">Accept</button>
          <button onClick={() => handleRespond(req.id, 'declined')} className="btn-secondary">Decline</button>
        </div>
      ))}
    </div>
  );
}
