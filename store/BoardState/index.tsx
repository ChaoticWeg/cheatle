import {
    BoardState,
    BoardStateAction,
    BoardStateIndexAction,
    BoardStateLetterAction,
    BoardStateLockAction,
    BSA_BKSP,
    BSA_INDEX,
    BSA_LETTER,
    BSA_LOCK,
    BSA_RESET
} from "../../typings/RowState";
import { BoardStateLetterReducer } from "./Letter";
import { BoardStateLockReducer } from "./Lock";

export const initialBoardState: BoardState = {
    index: 0,
    tiles: [
        { letter: "", lock: "no" },
        { letter: "", lock: "no" },
        { letter: "", lock: "no" },
        { letter: "", lock: "no" },
        { letter: "", lock: "no" }
    ]
};

export function initializeBoardState(): BoardState {
    return { ...initialBoardState };
}

export function BoardStateReducer(state: BoardState = initialBoardState, action: BoardStateAction) {
    switch (action.type) {
        case BSA_LOCK: {
            return BoardStateLockReducer(state, action as BoardStateLockAction);
        }
        case BSA_INDEX: {
            const { index } = (action as BoardStateIndexAction).payload;
            return { ...state, index };
        }
        case BSA_LETTER: {
            return BoardStateLetterReducer(state, action as BoardStateLetterAction);
        }
        case BSA_BKSP: {
            let { index } = state;
            if (index > 0) index -= 1;
            const tiles = [
                ...state.tiles.slice(0, index),
                { ...state.tiles[index], letter: "" },
                ...state.tiles.slice(index + 1)
            ];
            return { ...state, tiles, index };
        }
        case BSA_RESET: {
            return initializeBoardState();
        }
    }
}
