import { BoardState, BoardStateIndexAction } from "../../typings/RowState";

export function BoardStateIndexReducer(
    state: BoardState,
    action: BoardStateIndexAction
): BoardState {
    const { index, row: rowIndex } = (action as BoardStateIndexAction).payload;
    const { activeRow } = state;

    const isSameRow = rowIndex === activeRow;
    if (isSameRow) {
        return {
            ...state,
            rows: [
                ...state.rows.slice(0, activeRow),
                { ...state.rows[activeRow], index },
                ...state.rows.slice(activeRow + 1)
            ]
        };
    }

    // Set the "from" row index to zero
    // Need to determine which of the two ["from", "to"] row indices is lesser,
    // to preserve the order of rows
    const lowerRowIndex = Math.min(activeRow, rowIndex);
    const upperRowIndex = Math.max(activeRow, rowIndex);
    const isFromRowUpper = lowerRowIndex === activeRow;

    return {
        ...state,
        activeRow: rowIndex,
        rows: [
            ...state.rows.slice(0, lowerRowIndex),
            { ...state.rows[lowerRowIndex], index: isFromRowUpper ? 0 : index },
            ...state.rows.slice(lowerRowIndex + 1, upperRowIndex),
            { ...state.rows[upperRowIndex], index: isFromRowUpper ? index : 0 },
            ...state.rows.slice(upperRowIndex + 1)
        ]
    };
}
