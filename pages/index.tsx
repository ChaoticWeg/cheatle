import {
    ChevronDoubleDownIcon,
    ChevronDoubleUpIcon,
    SearchIcon,
    TrashIcon
} from "@heroicons/react/solid";
import clsx from "clsx";
import React from "react";
import toast from "react-hot-toast";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import _ from "underscore";
import { Row } from "../components/Row";
import { WordList } from "../components/WordList";
import { useBoardState } from "../hooks/useBoardState";
import { BSA_BKSP, BSA_LETTER, BSA_RESET, RowState, TileState } from "../typings/RowState";

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

    const list = React.useRef<HTMLOListElement>(null);

    const [showGoTop, setShowGoTop] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [words, setWords] = React.useState<string[]>([]);

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

        const fetchPromise = fetchWords(words, masks);

        toast.promise(fetchPromise, {
            loading: "loading",
            success: (data: string[]) =>
                `${data.length === 0 ? "no" : data.length} possible word${
                    data.length === 1 ? "" : "s"
                }`,
            error: (err) => `oops... ${err.message}`
        });

        fetchPromise
            .then(setWords)
            .then(() => {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        list.current?.scrollIntoView({ block: "start", behavior: "smooth" });
                    }, 1);
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [state?.rows]);

    const onClearPress = React.useCallback(() => {
        setWords([]);
        dispatch?.({
            type: BSA_RESET,
            payload: {}
        });
        requestAnimationFrame(() => {
            setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 1);
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

            if (e.key === "Backspace") {
                e.preventDefault();
                dispatch?.({
                    type: BSA_BKSP,
                    payload: {}
                });
                return;
            }

            const letter = e.key.toUpperCase();
            if (letter.match(/^[A-Z]$/)) {
                e.preventDefault();
                dispatch?.({
                    type: BSA_LETTER,
                    payload: { letter }
                });
            }
        },
        [dispatch]
    );

    const onGoTopPress = React.useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const onGoWordsPress = React.useCallback(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                list.current?.scrollIntoView({ block: "start", behavior: "smooth" });
            }, 1);
        });
    }, []);

    React.useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return function () {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [onKeyDown]);

    React.useEffect(() => {
        function _onScroll() {
            const pos = window.scrollY;
            setShowGoTop(pos > 50);
        }

        const onScroll = _.throttle(_onScroll, 100);

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navIconClassName = React.useMemo(() => {
        return clsx("h-7 transition-all ease-in-out duration-100", { "rotate-180": showGoTop });
    }, [showGoTop]);

    return (
        <div className="content">
            <h1 className="title">cheatle</h1>
            {state?.rows?.map((_row, i) => (
                <Row key={i} index={i} />
            ))}
            <WordList ref={list} loading={loading} words={words} />
            <div className="keyboard-container">
                <div className="w-full lg:w-2/5 mx-auto pt-3 pb-2 px-5 flex bg-nord4 dark:bg-nord2 rounded-md rounded-b-none">
                    <div className="mr-auto">
                        <button className="bg-nord11 hover:bg-nord15" onClick={onClearPress}>
                            <TrashIcon className="h-7" />
                        </button>
                    </div>
                    <div className="ml-auto">
                        <button
                            className="mr-2"
                            onClick={showGoTop ? onGoTopPress : onGoWordsPress}
                        >
                            <ChevronDoubleDownIcon className={navIconClassName} />
                        </button>
                        <button onClick={onFindPress}>
                            <SearchIcon className="h-7" />
                        </button>
                    </div>
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
                    <div className="version">
                        <span>v{process.env.NEXT_PUBLIC_VERSION ?? "0.0.0"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
