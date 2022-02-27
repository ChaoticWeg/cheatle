export type TileLockState = "no" | "yes" | "maybe";

export type TileState = {
    letter: string;
    lock: TileLockState;
};

export type BoardState = {
    index: number;
    tiles: TileState[];
};

type BoardStateActionType = "lock" | "letter" | "index" | "bksp" | "reset";
export const BSA_LOCK = "lock" as BoardStateActionType;
export const BSA_LETTER = "letter" as BoardStateActionType;
export const BSA_INDEX = "index" as BoardStateActionType;
export const BSA_BKSP = "bksp" as BoardStateActionType;
export const BSA_RESET = "reset" as BoardStateActionType;

export type BoardStateAction<T extends {} = {}> = {
    type: BoardStateActionType;
    payload: T;
};

type BoardStateLockPayload = { index: number };
export interface BoardStateLockAction extends BoardStateAction<BoardStateLockPayload> {
    type: "lock";
}

type BoardStateLetterPayload = { letter: string };
export interface BoardStateLetterAction extends BoardStateAction<BoardStateLetterPayload> {
    type: "letter";
}

type BoardStateIndexPayload = { index: number };
export interface BoardStateIndexAction extends BoardStateAction<BoardStateIndexPayload> {
    type: "index";
}

export interface BoardStateBackspaceAction extends BoardStateAction {
    type: "bksp";
}
