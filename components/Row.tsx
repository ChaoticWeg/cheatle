import React from "react";
import { useBoardState } from "../hooks/useBoardState";
import { BSA_INDEX, BSA_LOCK } from "../typings/RowState";
import { Tile } from "./Tile";

export function Row() {
    const { state, dispatch } = useBoardState();

    const onTileClick = React.useCallback(
        (index) => {
            dispatch?.({
                type: BSA_INDEX,
                payload: { index }
            });
        },
        [dispatch]
    );

    const onLockClick = React.useCallback(
        (index) => {
            dispatch?.({
                type: BSA_LOCK,
                payload: { index }
            });
        },
        [dispatch]
    );

    return (
        <div className="row">
            {state?.tiles?.map((tile, i) => (
                <Tile
                    key={i}
                    active={state?.index === i}
                    state={tile}
                    onClick={() => onTileClick(i)}
                    onLockClick={() => onLockClick(i)}
                />
            ))}
        </div>
    );
}
