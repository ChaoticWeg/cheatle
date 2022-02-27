import React, { ForwardedRef } from "react";
import _ from "underscore";

type WordListProps = {
    loading: boolean;
    words: string[];
};

type WordListInternalProps = WordListProps & {
    incomingRef?: ForwardedRef<HTMLOListElement>;
};

function WordListBase(props: WordListInternalProps) {
    const { incomingRef, loading, words } = props;

    return (
        <ol ref={incomingRef} className="word-list">
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

const WordList = React.forwardRef<HTMLOListElement, WordListProps>((props, ref) => (
    <WordListBase {...props} incomingRef={ref} />
));

WordList.displayName = "WordList";
export { WordList };
