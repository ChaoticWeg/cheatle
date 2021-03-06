import type { NextApiRequest, NextApiResponse } from "next";
import _ from "underscore";
import { default as wordsData } from "../../data/words.json";

export type FindSuccess = { ok: boolean; words: string[] };
export type FindFailure = { ok: boolean; message: string };
export type FindResponse = FindSuccess | FindFailure;

/**
 * First pass: get all words that don't match the incorrect letters and DO match the correct letters
 * @param wordsArr guesses
 * @param masksArr masks
 * @returns filtered candidates
 */
function firstPass(wordsArr: string[], masksArr: string[], candidates?: string[]): string[] {
    if (!candidates) {
        candidates = _.sortBy(wordsData.words);
    }

    const regexes: RegExp[] = [];

    for (let wi = 0; wi < wordsArr.length && wi < masksArr.length; wi++) {
        const thisWord = wordsArr[wi];
        const thisMask = masksArr[wi];

        if (_.isEmpty(thisWord) || _.isEmpty(thisMask)) {
            continue;
        }

        let thisRegexStr = "";

        for (let mi = 0; mi < thisWord.length && mi < thisMask.length; mi++) {
            const letter = thisWord[mi].toLowerCase();
            const maskChar = thisMask[mi];

            if (maskChar === "!") {
                thisRegexStr += `${letter}`;
            } else {
                thisRegexStr += `[^${letter}]`;
            }
        }

        regexes.push(new RegExp(`^${thisRegexStr}$`, "i"));
    }

    return _.filter(candidates, (candidate) => {
        return _.all(regexes, (reg) => !!candidate.match(reg));
    });
}

/**
 * Second pass: words that DO NOT contain ANY "nowhere" letters, but DO contain ALL "somewhere" letters
 * @param wordsArr guesses
 * @param masksArr masks
 * @param candidates candidates
 * @returns filtered candidates
 */
function secondPass(wordsArr: string[], masksArr: string[], candidates: string[]): string[] {
    let nowhere: string[] = [];
    let somewhere: string[] = [];
    let correct: string[] = [];

    for (let wi = 0; wi < wordsArr.length && wi < masksArr.length; wi++) {
        const word = wordsArr[wi].toLowerCase();
        const mask = masksArr[wi].toLowerCase();

        for (let mi = 0; mi < word.length && mi < mask.length; mi++) {
            const letter = word[mi];
            const thisMask = mask[mi];

            if (thisMask === "_" && !nowhere.includes(letter)) {
                nowhere.push(letter);
            }

            if (thisMask === "?" && !somewhere.includes(letter)) {
                somewhere.push(letter);
            }

            if (thisMask === "!" && !correct.includes(letter)) {
                correct.push(letter);
            }
        }
    }

    // Remove letters from "nowhere" if they exist in "somewhere" or "correct"
    nowhere = _.reject(nowhere, (n) => somewhere.includes(n) || correct.includes(n));

    return _.filter(candidates, (candidate) => {
        const hasNowheres = _.any(nowhere, (l) => candidate.includes(l));
        const hasSomewheres = _.all(somewhere, (l) => candidate.includes(l));
        return hasSomewheres && !hasNowheres;
    });
}

export default function handler(req: NextApiRequest, res: NextApiResponse<FindResponse>) {
    let { words, masks } = req.query;

    if (!words || !masks) {
        return res
            .status(400)
            .send({ ok: false, message: "words and masks are required GET params" });
    }

    if (Array.isArray(words) || Array.isArray(masks)) {
        return res.status(400).send({ ok: false, message: "don't send me arrays" });
    }

    words = words.split(",");
    masks = masks.split(",");

    let matches = firstPass(words, masks);
    matches = secondPass(words, masks, matches);

    return res.status(200).send({ ok: true, words: matches });
}
