import { joinRoom } from "trystero";
import type { Room, BaseRoomConfig } from "trystero";

const trysteroConfig: BaseRoomConfig = { appId: 'f9beb25d', password: 'f486b92c' }

let room: Room | null = null

export const getRoom = () => {
    if (room) return room

    if (typeof window === 'undefined')
        return null

    room = joinRoom(trysteroConfig, "0fbc26bb")
    return room
};
