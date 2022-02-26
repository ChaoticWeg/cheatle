import clsx from "clsx";
import React from "react";
import { TileLockState, TileState } from "../typings/RowState";

type TileProps = {
    active: boolean;
    state: TileState;
    onClick: () => void;
    onLockClick: () => void;
};

export function Tile(props: TileProps) {
    const { active, state, onClick, onLockClick } = props;

    const className = React.useMemo(
        () =>
            clsx("tile", {
                "tile-active": active,
                "tile-lock": state.lock === "yes",
                "tile-softlock": state.lock === "maybe",
                "tile-unlock": state.lock === "no"
            }),
        [active, state.lock]
    );

    return (
        <div className="tile-container">
            <div className={className} onClick={onClick}>
                <span>{state.letter}</span>
            </div>
            <div className="tile-icon-buttons" onClick={onLockClick}></div>
        </div>
    );
}
