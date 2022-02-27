import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/outline";
import { LockClosedIcon as LockLockedIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import React from "react";
import { TileState } from "../typings/RowState";

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

    const lockIcon = React.useMemo(() => {
        switch (state.lock) {
            case "yes":
                return <LockLockedIcon className="lock-icon" />;
            case "maybe":
                return <LockClosedIcon className="lock-icon" />;
            default:
                return <LockOpenIcon className="lock-icon" />;
        }
    }, [state.lock]);

    return (
        <div className="tile-container">
            <div className={className} onClick={onClick}>
                <span>{state.letter}</span>
            </div>
            <div className="tile-icon-buttons" onClick={onLockClick}>
                {lockIcon}
            </div>
        </div>
    );
}
