import { collections } from '../config/firebase';

export async function createMeeting({ userId, participants, summary, description, start, end, meetingLink }: any) {
  // TODO: Use OAuth2 tokens for the user
  // For demo, just store meeting in Firestore
  const meetingData = {
    userId,
    participants,
    summary,
    description,
    start,
    end,
    meetingLink,
    createdAt: new Date(),
  };
  const docRef = await collections.meetings.add(meetingData);
  return { id: docRef.id, ...meetingData };
}

export async function getMeetings(userId: string) {
  const snapshot = await collections.meetings.where('participants', 'array-contains', userId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
