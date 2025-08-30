import { useState } from 'react';
import { useConnections } from '../hooks/useConnections';

export function ConnectButton({ senderId, receiverId }: { senderId: string, receiverId: string }) {
  const { sendConnectionRequest } = useConnections();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setLoading(true); setError('');
    try {
      await sendConnectionRequest(senderId, receiverId);
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  if (sent) return <span className="text-green-600">Request Sent</span>;
  return (
    <div>
      <button onClick={handleConnect} disabled={loading} className="btn-primary">
        {loading ? 'Sending...' : 'Connect'}
      </button>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
}
