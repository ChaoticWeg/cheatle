import React from "react";
import _ from "underscore";

type WordListProps = {
    words: string[];
};

export function WordList(props: WordListProps) {
    const { words } = props;

    return (
        <ol className="word-list">
            {_.isEmpty(words) && <div className="word-list-empty">no words match the input</div>}
            {!_.isEmpty(words) &&
                words.map((w, i) => (
                    <li key={i} className="word-list-word">
                        {w.toUpperCase()}
                    </li>
                ))}
        </ol>
    );
}
