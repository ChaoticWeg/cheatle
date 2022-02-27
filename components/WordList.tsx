import React from "react";
import _ from "underscore";

type WordListProps = {
    loading: boolean;
    words: string[];
};

export function WordList(props: WordListProps) {
    const { loading, words } = props;

    return (
        <ol className="word-list">
            {loading && <div className="word-list-loading">loading</div>}
            {!loading && (
                <>
                    {_.isEmpty(words) && (
                        <div className="word-list-empty">no words match the input</div>
                    )}
                    {!_.isEmpty(words) &&
                        words.map((w, i) => (
                            <li key={i} className="word-list-word">
                                {w.toUpperCase()}
                            </li>
                        ))}
                </>
            )}
        </ol>
    );
}
