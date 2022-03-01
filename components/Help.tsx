import { Dialog, Transition } from "@headlessui/react";
import { CodeIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import React from "react";

type HelpProps = {
    open: boolean;
    onClose: () => void;
};

export function Help(props: HelpProps) {
    const { open, onClose } = props;

    const btnGotIt = React.useRef<HTMLButtonElement>(null);

    return (
        <Transition show={open}>
            <Dialog
                static
                open={open}
                onClose={onClose}
                className="help-dialog"
                initialFocus={btnGotIt}
            >
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-linear duration-75"
                    enterFrom="opacity-0"
                    enterTo="opacity-30"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-30"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="help-overlay" onClick={onClose} />
                </Transition.Child>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0 scale-75"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-75"
                >
                    <div className="help-content">
                        <div className="flex flex-row-reverse">
                            <div className="help-close" onClick={onClose}>
                                <XIcon />
                            </div>
                        </div>
                        <div className="help-content-header">
                            <Dialog.Title>cheatle</Dialog.Title>
                            <Dialog.Description>
                                <span className="text-nord4 font-light">
                                    ruining the competitive spirit of wordle, for fun
                                </span>
                            </Dialog.Description>
                        </div>
                        <div className="help-content-main">
                            <p>
                                Just like <a href="https://powerlanguage.co.uk/wordle/">Wordle</a>,
                                there&#39;s a grid of 6 rows of 5 tiles. Here, you can enter your
                                guesses and use the lock button underneath each tile to change
                                colors based on what Wordle tells you about the guess.
                            </p>
                            <p>
                                You can then tap or click the search button, and after a few ticks,{" "}
                                <span className="font-semibold">cheatle</span> will provide you with
                                a list of possible words to use as your next guess.
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Cheatle isn&#39;t going to help you <i>too</i> much, though!
                                </span>{" "}
                                The list of words is sorted alphabetically, <i>not</i> in any
                                particular order of quality. There&#39;s no{" "}
                                <a
                                    href="https://youtu.be/v68zYyaEmEA"
                                    title="3b1b"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    information theory
                                </a>{" "}
                                or other fancy math or stats involved here. You&#39;ll still have to
                                use your noodle to choose one.
                            </p>
                            <p>
                                Input is just like Wordle.
                                <br />
                                Report bugs on{" "}
                                <a
                                    href="https://github.com/chaoticweg/cheatle"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    GitHub
                                </a>
                                .
                                <br />
                                Good luck!
                            </p>
                        </div>
                        <div className="help-actions">
                            <a
                                className="inline-block mt-1.5 mr-auto ml-1"
                                href="https://github.com/chaoticweg/cheatle"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <CodeIcon className="h-6" />
                            </a>
                            <button className="ml-auto" ref={btnGotIt} onClick={onClose}>
                                Got it!
                            </button>
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
