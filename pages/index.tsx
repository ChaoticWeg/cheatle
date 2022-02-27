import React from "react";
import _ from "underscore";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { Row } from "../components/Row";
import { useBoardState } from "../hooks/useBoardState";
import { BSA_BKSP, BSA_LETTER, BSA_RESET, TileState } from "../typings/RowState";

const KeyboardLayout = {
    default: ["Q W E R T Y U I O P", "A S D F G H J K L", "Z X C V B N M {bksp}"]
};

const KeyboardDisplay = {
    "{bksp}": "⌫"
};

function fetchWords(word: string, mask: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const qs = `word=${encodeURIComponent(word)}&mask=${encodeURIComponent(mask)}`;
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

    const [loading, setLoading] = React.useState<boolean>(false);
    const [words, setWords] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (!_.isEmpty(words)) {
            console.log(words);
        }
    }, [words]);

    const { state, dispatch } = useBoardState();

    const onFindPress = React.useCallback(() => {
        const wordLength = _.reduce(
            state?.tiles ?? [],
            (l: number, r: TileState) => l + (r.letter === "" ? 0 : 1),
            0
        );

        if (wordLength !== 5) {
            alert("5 letters per guess please! got " + wordLength);
            return;
        }

        const word = _.reduce(
            state?.tiles ?? [],
            (l: string, r: TileState) => l + r.letter,
            ""
        ).toLowerCase();

        const mask = _.reduce(
            state?.tiles ?? [],
            (l: string, r: TileState) =>
                l + (() => "!_?".charAt(["yes", "no", "maybe"].indexOf(r.lock)))(),
            ""
        );

        if (mask === "!!!!!") {
            alert("you got it right. what do you need me for??");
            return;
        }

        setLoading(true);
        setWords([]);

        fetchWords(word, mask)
            .then(setWords)
            .catch((err) => alert(err.message))
            .finally(() => setLoading(false));
    }, [state?.tiles]);

    const onClearPress = React.useCallback(() => {
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

    return (
        <div className="content">
            <h1 className="title">Hello</h1>
            <Row />
            <div className="absolute bottom-0 left-0 w-screen flex flex-col">
                <div className="w-full lg:w-2/5 mx-auto p-2 mb-2 flex">
                    <button
                        className="block mr-auto bg-nord11 hover:bg-nord15"
                        onClick={onClearPress}
                    >
                        Clear
                    </button>
                    <button className="block ml-auto" onClick={onFindPress}>
                        Find
                    </button>
                </div>
                <div className="w-full lg:w-2/5 mx-auto">
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
