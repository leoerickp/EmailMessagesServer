import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { User } from '../users/entities/user.entity';
import { ConnectedClient } from './interfaces/connected-client.interface';

@Injectable()
export class MessagesWsService {

    private connectedClients: ConnectedClient = {};

    constructor(
        @InjectModel(User.name)
        private readonly usersModel: Model<User>,
    ) {

    }
    async registerClient(client: Socket, userId: string) {

        const user = await this.usersModel.findById(userId);
        if (!user) throw new Error("User not found");
        if (!user.isActive) throw new Error("User not active");


        this.checkUserConnection(user);

        this.connectedClients[client.id] = {
            socket: client,
            user
        };
    }

    private checkUserConnection(user: User) {
        for (const clientId of Object.keys(this.connectedClients)) {
            const connectedClient = this.connectedClients[clientId];
            if (connectedClient.user._id === user._id) {
                connectedClient.socket.disconnect();
                break;
            }
        }
    }

    getConnectedClients(): string[] {
        return Object.keys(this.connectedClients);
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getUserFullName(socketId: string) {
        return this.connectedClients[socketId].user.fullName;
    }
}
