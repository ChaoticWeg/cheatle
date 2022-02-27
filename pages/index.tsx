import React from "react";
import _ from "underscore";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { Row } from "../components/Row";
import { useBoardState } from "../hooks/useBoardState";
import { BSA_BKSP, BSA_LETTER, BSA_RESET, RowState, TileState } from "../typings/RowState";
import { WordList } from "../components/WordList";
import clsx from "clsx";

const KeyboardLayout = {
    default: ["Q W E R T Y U I O P", "A S D F G H J K L", "Z X C V B N M {bksp}"]
};

const KeyboardDisplay = {
    "{bksp}": "⌫"
};

function fetchWords(words: string[], masks: string[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const wordsStr = encodeURIComponent(words.join(","));
        const masksStr = encodeURIComponent(masks.join(","));
        const qs = `words=${wordsStr}&masks=${masksStr}`;
        fetch(`/api/find?${qs}`)
            .then((res) => res.json())
            .then(({ ok, message, words }) => {
                if (!ok) return reject(new Error(message));
                if (_.isEmpty(words)) return reject(new Error("no words match the clue"));
                return resolve(words);
            })
            .catch(reject);
    });
}

function Home() {
    const keyboard = React.useRef();
    const setKeyboardRef = React.useCallback((ref) => (keyboard.current = ref), []);

    const [hideKeyboard, setHideKeyboard] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [words, setWords] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (!_.isEmpty(words)) {
            console.log(words);
        }
    }, [words]);

    const { state, dispatch } = useBoardState();

    const onFindPress = React.useCallback(() => {
        const words: string[] = _.reduce(
            state?.rows ?? [],
            (l: string[], r: RowState) => [
                ...l,
                _.reduce(r.tiles ?? [], (l: string, r: TileState) => l + r.letter, "")
            ],
            []
        );

        const masks: string[] = _.reduce(
            state?.rows ?? [],
            (l: string[], r: RowState) => [
                ...l,
                _.reduce(
                    r.tiles ?? [],
                    (l: string, r: TileState) => {
                        switch (r.lock) {
                            case "no":
                                return l + "_";
                            case "maybe":
                                return l + "?";
                            case "yes":
                                return l + "!";
                            default:
                                return l + ".";
                        }
                    },
                    ""
                )
            ],
            []
        );

        setLoading(true);
        setWords([]);

        fetchWords(words, masks)
            .then(setWords)
            .catch((err) => alert(err.message))
            .finally(() => setLoading(false));
    }, [state?.rows]);

    const onHidePress = React.useCallback(() => {
        setHideKeyboard((hkb) => !hkb);
    }, []);

    const onClearPress = React.useCallback(() => {
        setWords([]);
        dispatch?.({
            type: BSA_RESET,
            payload: {}
        });
    }, [dispatch]);

    /**
     * Software keyboard press
     */
    const onSoftKeyPress = React.useCallback(
        (button) => {
            if (button.toUpperCase() === "{BKSP}") {
                dispatch?.({
                    type: BSA_BKSP,
                    payload: {}
                });
            } else {
                dispatch?.({
                    type: BSA_LETTER,
                    payload: { letter: button }
                });
            }
        },
        [dispatch]
    );

    /**
     * Hardware keyboard press
     */
    const onKeyDown = React.useCallback(
        (e: KeyboardEvent) => {
            if (e.isComposing || e.keyCode === 229) {
                // Known Firefox issue: don't capture during IME composition
                // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
                return;
            }

            if (e.ctrlKey || e.altKey || e.metaKey || e.repeat) {
                // Don't capture event if ctrl/alt/meta, or repeated (held) keystroke
                return;
            }

            e.preventDefault();

            if (e.key === "Backspace") {
                dispatch?.({
                    type: BSA_BKSP,
                    payload: {}
                });
                return;
            }

            const letter = e.key.toUpperCase();
            if (letter.match(/^[A-Z]$/)) {
                dispatch?.({
                    type: BSA_LETTER,
                    payload: { letter }
                });
            }
        },
        [dispatch]
    );

    React.useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return function () {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [onKeyDown]);

    const keyboardContainerClassName = React.useMemo(
        () =>
            clsx("absolute left-0 w-screen flex flex-col transition-all ease-in-out duration-100", {
                "-bottom-40": hideKeyboard,
                "bottom-0": !hideKeyboard
            }),
        [hideKeyboard]
    );

    const hideButtonText = React.useMemo(() => (hideKeyboard ? "Show" : "Hide"), [hideKeyboard]);

    return (
        <div className="content">
            <h1 className="title">cheatle</h1>
            {state?.rows?.map((row, i) => (
                <Row key={i} index={i} />
            ))}
            <WordList words={words} />
            <div className={keyboardContainerClassName}>
                <div className="w-full lg:w-2/5 mx-auto py-3 px-5 flex bg-nord4 dark:bg-nord2 rounded-md rounded-b-none">
                    <button
                        className="block mr-auto bg-nord11 hover:bg-nord15"
                        onClick={onClearPress}
                    >
                        Clear
                    </button>
                    <button
                        className="block mx-auto bg-nord12 hover:bg-nord13"
                        onClick={onHidePress}
                    >
                        {hideButtonText}
                    </button>
                    <button className="block ml-auto" onClick={onFindPress}>
                        Find
                    </button>
                </div>
                <div className="w-full lg:w-2/5 h-40 mx-auto">
                    <Keyboard
                        disableButtonHold
                        display={KeyboardDisplay}
                        keyboardRef={setKeyboardRef}
                        layout={KeyboardLayout}
                        onKeyPress={onSoftKeyPress}
                        physicalKeyboardHighlight
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
