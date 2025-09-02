import { useState } from 'react';
import { useNotification } from './ui/NotificationProvider';
import { useConnections } from '../hooks/useConnections';

export function ConnectButton({ senderId, receiverId }: { senderId: string, receiverId: string }) {
  const { sendConnectionRequest } = useConnections();
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setLoading(true); setError('');
    try {
      await sendConnectionRequest(senderId, receiverId);
      setSent(true);
      notify('Connection request sent!', 'success');
    } catch (e: any) {
      setError(e.message);
      notify(e.message || 'Failed to send request', 'error');
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
