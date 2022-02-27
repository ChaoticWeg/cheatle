import { BoardState, BoardStateLockAction, TileLockState } from "../../typings/RowState";

export function BoardStateLockReducer(state: BoardState, action: BoardStateLockAction): BoardState {
    const { index, row: rowIndex } = action.payload;
    const { rows } = state;

    const newLock: TileLockState = (() => {
        switch (rows[rowIndex].tiles[index].lock) {
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

    const newTiles = [
        ...rows[rowIndex].tiles.slice(0, index),
        { ...rows[rowIndex].tiles[index], lock: newLock },
        ...rows[rowIndex].tiles.slice(index + 1)
    ];

    const newRows = [
        ...rows.slice(0, rowIndex),
        { ...rows[rowIndex], tiles: newTiles },
        ...rows.slice(rowIndex + 1)
    ];

    return { ...state, rows: newRows, activeRow: rowIndex };
}
