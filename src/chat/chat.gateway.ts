import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway(5001, { cors: { origin: '*' } }) 
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  private activeUsers = new Map<string, string>(); // Maps socketId -> userId

  async handleConnection(client: Socket) {
    console.log(client);
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const userId = this.activeUsers.get(client.id);
    if (userId) {
      this.server.emit('userDisconnected', { userId });
    }
    this.activeUsers.delete(client.id);
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, userId: string) {
    this.activeUsers.set(client.id, userId);
    client.emit('joined', `User ${userId} joined`);
    this.server.emit('userJoined', { userId });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: { senderId: string; content: string; groupId?: string }) {
    const message = await this.chatService.saveMessage(payload.senderId, payload.content, payload.groupId);
    
    if (payload.groupId) {
      // Send to a specific group
      this.server.to(payload.groupId).emit('receiveMessage', message);
    } else {
      // Send to a specific user (direct chat)
      const recipientSocketId = [...this.activeUsers.entries()].find(([_, id]) => id === payload.senderId)?.[0];
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit('receiveMessage', message);
      }
    }
  }

  @SubscribeMessage('createGroup')
  async handleCreateGroup(client: Socket, payload: { name: string; userIds: string[] }) {
   
    const group = await this.chatService.createGroup(payload.name, payload.userIds);

    try {
      payload.userIds.forEach(userId => {
       
        
        const userSocketId = [...this.activeUsers.entries()].find(([_, id]) => id === userId)?.[0];
        
       
    
        if (userSocketId) {
          this.server.sockets.sockets.get(userSocketId)?.join(group.id);
          console.log(`✅ User ${userId} with socket ${userSocketId} joined room ${group.id}`);
        } else {
          console.log(`❌ No socket found for User ID: ${userId}`);
        }
      });
    } catch (error) {
      console.log('🔥 Error:', error);
    }
    
    this.server.emit('groupCreated', group);
  }
}
