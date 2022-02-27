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

    const ref = React.useRef<HTMLDivElement>(null);
    const { state, dispatch } = useBoardState();

    const onTileClick = React.useCallback(
        (index) => {
            const action: BoardStateIndexAction = {
                type: "index",
                payload: { index, row: rowIndex }
            };
            dispatch?.(action);
            requestAnimationFrame(() => {
                setTimeout(() => {
                    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                }, 1);
            });
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
            requestAnimationFrame(() => {
                setTimeout(() => {
                    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                }, 1);
            });
        },
        [rowIndex, dispatch]
    );

    return (
        <div className="row" ref={ref}>
            {state?.rows[rowIndex]?.tiles?.map((tile, i) => (
                <Tile
                    key={i}
                    active={state?.activeRow === rowIndex && state?.rows[rowIndex].index === i}
                    focusBoundary={rowIndex === 0 ? "end" : "center"}
                    focusOnActive={rowIndex + i > 0}
                    state={tile}
                    onClick={() => onTileClick(i)}
                    onLockClick={() => onLockClick(i)}
                />
            ))}
        </div>
    );
}
