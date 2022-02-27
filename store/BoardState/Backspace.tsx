import { BoardState, BoardStateBackspaceAction } from "../../typings/RowState";

export function BoardStateBackspaceReducer(
    state: BoardState,
    action: BoardStateBackspaceAction
): BoardState {
    let { activeRow, rows } = state;
    let editedRow = { ...rows[activeRow] };
    let { index } = editedRow;

    if (index > 0) {
        index--;
    } else if (activeRow > 0) {
        activeRow--;
        index = 4;
        editedRow = { ...rows[activeRow] };
    }

    editedRow.index = index;
    editedRow.tiles[index] = { letter: "", lock: "no" };

    let resultState: BoardState = {
        activeRow,
        rows: [...rows.slice(0, activeRow), { ...editedRow }, ...rows.slice(activeRow + 1)]
    };

    return resultState;
}
