export declare function createMeeting({ userId, participants, summary, description, start, end, meetingLink }: any): Promise<{
    userId: any;
    participants: any;
    summary: any;
    description: any;
    start: any;
    end: any;
    meetingLink: any;
    createdAt: Date;
    id: string;
}>;
export declare function getMeetings(userId: string): Promise<{
    id: string;
}[]>;
//# sourceMappingURL=calendar.d.ts.map