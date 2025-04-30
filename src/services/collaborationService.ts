
import { toast } from "sonner";

// Defines a participant in a collaborative session
export interface Participant {
  id: string;
  name: string;
  color: string;
  cursor?: { line: number; ch: number };
  selection?: { from: { line: number; ch: number }; to: { line: number; ch: number } };
}

// Available colors for participants
const PARTICIPANT_COLORS = [
  "#FF5733", // Red
  "#33FF57", // Green
  "#3357FF", // Blue
  "#F3FF33", // Yellow
  "#FF33F3", // Pink
  "#33FFF3", // Cyan
  "#FF9933", // Orange
  "#9933FF", // Purple
];

export class CollaborationService {
  private roomId: string | null = null;
  private participants: Map<string, Participant> = new Map();
  private userId: string = `user-${Math.random().toString(36).substr(2, 9)}`;
  private userName: string = `User ${Math.floor(Math.random() * 1000)}`;
  private userColor: string = PARTICIPANT_COLORS[Math.floor(Math.random() * PARTICIPANT_COLORS.length)];
  private onParticipantsChange: ((participants: Participant[]) => void) | null = null;
  private onDocumentChange: ((content: string) => void) | null = null;
  
  // In a real implementation, this would connect to a WebSocket server
  joinRoom(documentId: string, initialContent: string): Promise<boolean> {
    if (this.roomId) {
      this.leaveRoom();
    }
    
    this.roomId = documentId;
    this.participants.clear();
    
    // Add the current user to participants
    this.participants.set(this.userId, {
      id: this.userId,
      name: this.userName,
      color: this.userColor
    });
    
    // Simulate receiving participants (in real implementation, this would come from the server)
    setTimeout(() => {
      // Simulate 1-3 other participants
      const otherCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < otherCount; i++) {
        const otherId = `user-${Math.random().toString(36).substr(2, 9)}`;
        const otherName = `User ${Math.floor(Math.random() * 1000)}`;
        const otherColor = PARTICIPANT_COLORS[Math.floor(Math.random() * PARTICIPANT_COLORS.length)];
        
        this.participants.set(otherId, {
          id: otherId,
          name: otherName,
          color: otherColor,
          cursor: {
            line: Math.floor(Math.random() * 10),
            ch: Math.floor(Math.random() * 20)
          }
        });
      }
      
      if (this.onParticipantsChange) {
        this.onParticipantsChange(Array.from(this.participants.values()));
      }
      
      toast.success(`Joined collaborative editing session`, {
        description: `${this.participants.size} ${this.participants.size === 1 ? 'person' : 'people'} in the room`
      });
    }, 1000);
    
    return Promise.resolve(true);
  }
  
  leaveRoom(): void {
    if (!this.roomId) return;
    
    this.roomId = null;
    this.participants.clear();
    
    if (this.onParticipantsChange) {
      this.onParticipantsChange([]);
    }
    
    toast.info("Left collaborative session");
  }
  
  updateDocument(content: string): void {
    if (!this.roomId) return;
    
    // In a real implementation, this would send the update to the server
    // Simulate sending to other participants
    setTimeout(() => {
      if (this.roomId && this.onDocumentChange) {
        // In a real implementation, this would be a message from the server
        // We're just echoing it back for simulation
        this.onDocumentChange(content);
      }
    }, 100);
  }
  
  updateCursorPosition(line: number, ch: number): void {
    if (!this.roomId) return;
    
    const currentUser = this.participants.get(this.userId);
    if (currentUser) {
      currentUser.cursor = { line, ch };
      this.participants.set(this.userId, currentUser);
      
      // In a real implementation, this would send the update to the server
    }
  }
  
  setParticipantsChangeListener(callback: (participants: Participant[]) => void): void {
    this.onParticipantsChange = callback;
  }
  
  setDocumentChangeListener(callback: (content: string) => void): void {
    this.onDocumentChange = callback;
  }
  
  getCurrentUserId(): string {
    return this.userId;
  }
  
  isCollaborating(): boolean {
    return this.roomId !== null;
  }
  
  // For demo/testing purposes
  simulateRemoteChange(content: string): void {
    if (!this.roomId || !this.onDocumentChange) return;
    this.onDocumentChange(content);
  }
}

export const collaborationService = new CollaborationService();
