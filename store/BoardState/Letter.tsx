import { BoardState, BoardStateLetterAction } from "../../typings/RowState";

export function BoardStateLetterReducer(
    state: BoardState,
    action: BoardStateLetterAction
): BoardState {
    const { letter } = action.payload;
    let { activeRow, rows } = state;

    let row = rows[activeRow];
    let { index } = row;

    if (index >= rows[activeRow].tiles.length) {
        return state;
    }

    const tiles = [
        ...row.tiles.slice(0, index),
        { ...row.tiles[index], letter },
        ...row.tiles.slice(index + 1)
    ];

    index++;

    row = { ...row, tiles, index };
    rows = [...rows.slice(0, activeRow), { ...row }, ...rows.slice(activeRow + 1)];

    if (index >= 5) {
        activeRow++;
    }

    return { ...state, rows, activeRow };
}
