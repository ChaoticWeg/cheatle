import React from "react";
import _ from "underscore";
import { useBoardState } from "../hooks/useBoardState";
import { BSA_LOCK } from "../typings/RowState";
import { Tile } from "./Tile";

type RowProps = {
    currentIndex: number;
    setCurrentIndex: (i: number) => void;
};

const dummyArray = Array.from(new Array(5)).map((_, i) => i);

export function Row(props: RowProps) {
    const { currentIndex, setCurrentIndex } = props;
    const { state, dispatch } = useBoardState();

    const onTileClick = React.useCallback((index) => setCurrentIndex(index), [setCurrentIndex]);

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
            {state?.map((tile, i) => (
                <Tile
                    key={i}
                    active={currentIndex === i}
                    state={tile}
                    onClick={() => onTileClick(i)}
                    onLockClick={() => onLockClick(i)}
                />
            ))}
        </div>
    );
}
