// import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server } from 'socket.io';

// @WebSocketGateway()
// export class CalendarGateway {
//   @WebSocketServer()
//   server: Server;

//   sendEventUpdate(event: Event) {
//     this.server.emit('event-update', event);
//   }
// }