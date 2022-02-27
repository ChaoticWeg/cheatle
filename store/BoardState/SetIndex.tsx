import { BoardState, BoardStateIndexAction } from "../../typings/RowState";

export function BoardStateIndexReducer(
    state: BoardState,
    action: BoardStateIndexAction
): BoardState {
    const { index, row: rowIndex } = (action as BoardStateIndexAction).payload;

    return {
        ...state,
        activeRow: rowIndex,
        rows: [
            ...state.rows.slice(0, rowIndex),
            { ...state.rows[rowIndex], index },
            ...state.rows.slice(rowIndex + 1)
        ]
    };
}
