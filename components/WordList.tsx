import React from "react";

type WordListProps = {
    words: string[];
};

export function WordList(props: WordListProps) {
    const { words } = props;

    return (
        <ol className="word-list">
            {words.map((w, i) => (
                <li key={i} className="word-list-word">
                    {w.toUpperCase()}
                </li>
            ))}
        </ol>
    );
}
