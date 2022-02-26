import {
    BoardState,
    BoardStateAction,
    BoardStateLockAction,
    BSA_LOCK,
    BSA_RESET,
    TileLockState
} from "../typings/RowState";

export const initialBoardState: BoardState = [
    { letter: "", lock: "no" },
    { letter: "", lock: "no" },
    { letter: "", lock: "no" },
    { letter: "", lock: "no" },
    { letter: "", lock: "no" }
];

export function initializeBoardState(): BoardState {
    return [...initialBoardState];
}

export function BoardStateReducer(state: BoardState = initialBoardState, action: BoardStateAction) {
    switch (action.type) {
        case BSA_LOCK: {
            const { index } = (action as BoardStateLockAction).payload;

            const newLock: TileLockState = (() => {
                switch (state[index].lock) {
                    case "no":
                        return "maybe";
                    case "maybe":
                        return "yes";
                    case "yes":
                        return "no";
                    default:
                        throw new Error();
                }
            })();

            return [
                ...state.slice(0, index),
                { ...state[index], lock: newLock },
                ...state.slice(index + 1)
            ];
        }
        case BSA_RESET: {
            return initializeBoardState();
        }
    }
}
