import React from "react";
import { useBoardState } from "../hooks/useBoardState";
import {
    BoardStateIndexAction,
    BoardStateLockAction,
    BSA_INDEX,
    BSA_LOCK
} from "../typings/RowState";
import { Tile } from "./Tile";

type RowProps = {
    index: number;
};

export function Row(props: RowProps) {
    const { index: rowIndex } = props;
    const { state, dispatch } = useBoardState();

    const onTileClick = React.useCallback(
        (index) => {
            const action: BoardStateIndexAction = {
                type: "index",
                payload: { index, row: rowIndex }
            };
            dispatch?.(action);
        },
        [rowIndex, dispatch]
    );

    const onLockClick = React.useCallback(
        (index) => {
            const action: BoardStateLockAction = {
                type: "lock",
                payload: { index, row: rowIndex }
            };

            dispatch?.(action);
        },
        [rowIndex, dispatch]
    );

    return (
        <div className="row">
            {state?.rows[rowIndex]?.tiles?.map((tile, i) => (
                <Tile
                    key={i}
                    active={state?.activeRow === rowIndex && state?.rows[rowIndex].index === i}
                    state={tile}
                    onClick={() => onTileClick(i)}
                    onLockClick={() => onLockClick(i)}
                />
            ))}
        </div>
    );
}
