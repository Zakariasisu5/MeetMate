import { useEffect, useState } from 'react';
import { useConnections } from '../hooks/useConnections';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export function ConnectionsList({ userId }: { userId: string }) {
  const { getConnections } = useConnections();
  const [connections, setConnections] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    const unsub = getConnections(userId, setConnections);
    return () => unsub && unsub();
  }, [userId]);

  useEffect(() => {
    Promise.all(
      connections.map(async (conn) => {
        const otherId = conn.senderId === userId ? conn.receiverId : conn.senderId;
        const userDoc = await getDoc(doc(db, 'users', otherId));
        return userDoc.exists() ? userDoc.data() : null;
      })
    ).then(setProfiles);
  }, [connections, userId]);

  return (
    <div>
      <h3 className="font-semibold mb-2">My Connections</h3>
      <ul>
        {profiles.length === 0 && <li>No connections yet.</li>}
        {profiles.map((user, i) =>
          user && (
            <li key={i} className="flex items-center gap-2 mb-2">
              <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
              <span>{user.displayName}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
