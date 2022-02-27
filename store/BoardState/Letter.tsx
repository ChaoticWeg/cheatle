import { BoardState, BoardStateLetterAction } from "../../typings/RowState";

export function BoardStateLetterReducer(state: BoardState, action: BoardStateLetterAction) {
    const { letter } = action.payload;
    const { index } = state;
    const tiles = [
        ...state.tiles.slice(0, index),
        { ...state.tiles[index], letter },
        ...state.tiles.slice(index + 1)
    ];
    return { ...state, tiles, index: index + 1 };
}
