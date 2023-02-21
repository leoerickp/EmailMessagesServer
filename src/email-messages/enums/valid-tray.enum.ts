import { registerEnumType } from "@nestjs/graphql";

export enum ValidTray {
    inbox = 'inbox',
    outbox = 'outbox',
    recycle = 'recycle'
}

registerEnumType(ValidTray, { name: 'ValidTray' });