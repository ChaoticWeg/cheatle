import React from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { Row } from "../components/Row";
import { useBoardState } from "../hooks/useBoardState";
import { BSA_BKSP, BSA_LETTER } from "../typings/RowState";

const KeyboardLayout = {
    default: ["Q W E R T Y U I O P", "A S D F G H J K L", "Z X C V B N M {bksp}"]
};

const KeyboardDisplay = {
    "{bksp}": "⌫"
};

function Home() {
    const keyboard = React.useRef();
    const setKeyboardRef = React.useCallback((ref) => (keyboard.current = ref), []);

    const { dispatch } = useBoardState();

    const onKeyPress = React.useCallback(
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

    return (
        <div className="content">
            <h1 className="title">Hello</h1>
            <Row />
            <div className="absolute bottom-0 left-0 w-screen">
                <div className="w-full lg:w-2/5 mx-auto">
                    <Keyboard
                        disableButtonHold
                        display={KeyboardDisplay}
                        keyboardRef={setKeyboardRef}
                        layout={KeyboardLayout}
                        onKeyPress={onKeyPress}
                        physicalKeyboardHighlight
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
