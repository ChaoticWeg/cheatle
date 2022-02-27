import type { NextApiRequest, NextApiResponse } from "next";
import { default as wordsData } from "../../data/words.json";
import _ from "underscore";

type FindSuccess = { ok: boolean; words: string[] };
type FindFailure = { ok: boolean; message: string };
type FindResponse = FindSuccess | FindFailure;

export default function handler(req: NextApiRequest, res: NextApiResponse<FindResponse>) {
    const { word, mask } = req.query;

    if (!word || !mask) {
        return res
            .status(400)
            .send({ ok: false, message: "word and mask are required GET params" });
    }

    if (Array.isArray(word) || Array.isArray(mask)) {
        return res
            .status(400)
            .send({ ok: false, message: "why are you sending me arrays? send me strings" });
    }

    if (word.length !== 5 || mask.length !== 5) {
        return res
            .status(400)
            .send({ ok: false, message: "bad word or mask: must have length of 5" });
    }

    const { words } = wordsData;
    const wordArr = word.split("");
    const maskArr = mask.split("");

    let matchRegexStr: string = "";
    let notInWordArr: string[] = [];
    let somewhereInWordArr: string[] = [];

    for (let i = 0; i < wordArr.length && i < maskArr.length; i++) {
        let thisLetter = wordArr[i].toLowerCase();
        let thisMask = maskArr[i];

        switch (thisMask) {
            case "_": {
                if (
                    !notInWordArr.includes(thisLetter.toLowerCase()) &&
                    !somewhereInWordArr.includes(thisLetter.toLowerCase())
                )
                    notInWordArr.push(thisLetter.toLowerCase());
                matchRegexStr += `[^${thisLetter}]`;
                break;
            }
            case "?": {
                if (!somewhereInWordArr.includes(thisLetter.toLowerCase()))
                    somewhereInWordArr.push(thisLetter.toLowerCase());
                matchRegexStr += `[^${thisLetter}]`;
                break;
            }
            case "!": {
                matchRegexStr += thisLetter;
                break;
            }
            default: {
                return res
                    .status(400)
                    .send({ ok: false, message: `invalid mask character: ${thisMask}` });
            }
        }
    }

    const matchRegex = new RegExp(`^${matchRegexStr}$`, "i");
    const notInWordRegex = new RegExp(`^[^${notInWordArr.join("")}]{5}$`);

    console.log(`
        MATCH REGEX: ${matchRegex}
        NOT IN WORD REGEX: ${notInWordRegex}
        SOMEWHERE IN WORD ARR: ${somewhereInWordArr.join("")}
    `);

    const matches = _.filter(words, (word: string) => {
        return !!(
            word.match(matchRegex) &&
            (_.isEmpty(notInWordArr) ? true : word.match(notInWordRegex)) &&
            (_.isEmpty(somewhereInWordArr)
                ? true
                : _.all(somewhereInWordArr, (l) => word.includes(l)))
        );
    });

    return res.status(200).send({ ok: true, words: matches });
}
