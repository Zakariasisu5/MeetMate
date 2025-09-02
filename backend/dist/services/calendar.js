"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMeeting = createMeeting;
exports.getMeetings = getMeetings;
const firebase_1 = require("../config/firebase");
async function createMeeting({ userId, participants, summary, description, start, end, meetingLink }) {
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
    const docRef = await firebase_1.collections.meetings.add(meetingData);
    return { id: docRef.id, ...meetingData };
}
async function getMeetings(userId) {
    const snapshot = await firebase_1.collections.meetings.where('participants', 'array-contains', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
//# sourceMappingURL=calendar.js.map