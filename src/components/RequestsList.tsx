import { useEffect, useState } from 'react';
import { useConnections } from '../hooks/useConnections';
import toast from 'react-hot-toast';

export function RequestsList({ userId }: { userId: string }) {
  const { listenToIncomingRequests, respondToRequest } = useConnections();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const unsub = listenToIncomingRequests(userId, setRequests);
    return () => unsub && unsub();
  }, [userId]);

  const handleRespond = async (id: string, response: 'accepted' | 'declined') => {
    await respondToRequest(id, response);
    toast.success(response === 'accepted' ? '✅ Accepted' : '❌ Declined');
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Incoming Requests</h3>
      {requests.length === 0 && <div>No pending requests.</div>}
      {requests.map(req => (
        <div key={req.id} className="flex items-center gap-2 mb-2">
          <img src={req.sender.photoURL} alt={req.sender.displayName} className="w-8 h-8 rounded-full" />
          <span>{req.sender.displayName}</span>
          <button onClick={() => handleRespond(req.id, 'accepted')} className="btn-primary">Accept</button>
          <button onClick={() => handleRespond(req.id, 'declined')} className="btn-secondary">Decline</button>
        </div>
      ))}
    </div>
  );
}
