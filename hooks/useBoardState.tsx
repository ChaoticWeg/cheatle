import React from "react";
import {
    BoardStateReducer,
    initialBoardState,
    initializeBoardState
} from "../store/BoardStateStore";
import type { BoardState, BoardStateAction } from "../typings/RowState";

type IBoardStateContext = {
    state?: BoardState;
    dispatch?: React.Dispatch<BoardStateAction>;
};

const BoardStateContext = React.createContext<IBoardStateContext>({
    state: [],
    dispatch: () => []
});

type BoardStateProviderProps = {
    children?: React.ReactNode;
};

export function BoardStateProvider(props: BoardStateProviderProps) {
    const { children } = props;

    const [state, dispatch] = React.useReducer(
        BoardStateReducer,
        initialBoardState,
        initializeBoardState
    );

    return (
        <BoardStateContext.Provider value={{ state, dispatch }}>
            {children}
        </BoardStateContext.Provider>
    );
}

export function useBoardState() {
    return React.useContext(BoardStateContext);
}
