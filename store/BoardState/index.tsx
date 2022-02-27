import {
    BoardState,
    BoardStateAction,
    BoardStateBackspaceAction,
    BoardStateIndexAction,
    BoardStateLetterAction,
    BoardStateLockAction,
    BSA_BKSP,
    BSA_INDEX,
    BSA_LETTER,
    BSA_LOCK,
    BSA_RESET,
    RowState,
    TileState
} from "../../typings/RowState";
import { BoardStateBackspaceReducer } from "./Backspace";
import { BoardStateLetterReducer } from "./Letter";
import { BoardStateLockReducer } from "./Lock";
import { BoardStateIndexReducer } from "./SetIndex";

export function initializeBoardState(): BoardState {
    const result: BoardState = {
        activeRow: 0,
        rows: (() => {
            const rows: RowState[] = [];
            for (let i = 0; i < 6; i++) {
                rows[i] = {
                    index: 0,
                    tiles: (() => {
                        const tiles: TileState[] = [];
                        for (let j = 0; j < 5; j++) {
                            tiles[j] = { letter: "", lock: "no" };
                        }
                        return tiles;
                    })()
                };
            }
            return rows;
        })()
    };

    return result;
}

export const initialBoardState: BoardState = initializeBoardState();

export function BoardStateReducer(
    state: BoardState = initialBoardState,
    action: BoardStateAction
): BoardState {
    switch (action.type) {
        case BSA_LOCK:
            return BoardStateLockReducer(state, action as BoardStateLockAction);
        case BSA_INDEX:
            return BoardStateIndexReducer(state, action as BoardStateIndexAction);
        case BSA_LETTER:
            return BoardStateLetterReducer(state, action as BoardStateLetterAction);
        case BSA_BKSP:
            return BoardStateBackspaceReducer(state, action as BoardStateBackspaceAction);
        case BSA_RESET:
            return initializeBoardState();
        default:
            return state;
    }
}
