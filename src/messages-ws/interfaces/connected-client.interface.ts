import { Socket } from "socket.io";
import { User } from "src/users/entities/user.entity";

export interface ConnectedClient {
    [id: string]: {
        socket: Socket,
        user: User,
    }
}