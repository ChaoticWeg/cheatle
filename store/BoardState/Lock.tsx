import { BoardState, BoardStateLockAction, TileLockState } from "../../typings/RowState";

export function BoardStateLockReducer(state: BoardState, action: BoardStateLockAction) {
    const { index } = action.payload;

    const newLock: TileLockState = (() => {
        switch (state.tiles[index].lock) {
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

    const tiles = [
        ...state.tiles.slice(0, index),
        { ...state.tiles[index], lock: newLock },
        ...state.tiles.slice(index + 1)
    ];

    return { ...state, tiles };
}
