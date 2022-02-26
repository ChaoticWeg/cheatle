export type TileLockState = "no" | "yes" | "maybe";

export type TileState = {
    letter: string;
    lock: TileLockState;
};

export type BoardState = TileState[];

type BoardStateActionType = "lock" | "letter" | "reset";
export const BSA_LOCK = "lock" as BoardStateActionType;
export const BSA_LETTER = "letter" as BoardStateActionType;
export const BSA_RESET = "reset" as BoardStateActionType;

export type BoardStateAction<T extends {} = {}> = {
    type: BoardStateActionType;
    payload: T;
};

type BoardStateLockPayload = { index: number };
export interface BoardStateLockAction extends BoardStateAction<BoardStateLockPayload> {
    type: "lock";
}
