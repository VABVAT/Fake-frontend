type EvidenceItem = {
  quote: string;
  source: string;
};

type DebugData = {
  verdict: string;
  confidence: number; // numeric string like "0.6"
  evidence: EvidenceItem[];
  recommended_actions: string;
  reasoning: string;
};

type Props = {
  debug: DebugData;
};
const Container = ({debug}: Props) => {
    const contents = debug
//     {
//         "verdict": "misleading",
//         "confidence": "0.5",
//         "evidence": [
//             {
//             "quote": "The 2026 FIFA World Cup, marketed as FIFA World Cup 26, will be the 23rd FIFA World Cup... It will be jointly hosted by 16 cities in three North American countries; the main host country of matches is the United States, while Canada and Mexico will be the auxiliary hosts.",
//             "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHnCKugfXtjDiz0Xamrvh31Qqlm-V6MGSnLreEB_XBixV-oJ13DdNH4GoOIUhjp6O-D7NousDL-PY67oOFf-55RaneaKABd0qp_mZ1cfkgbncrsYaltJPg3CCZ7qinni79pWD8FTKKwrk9mpA=="
//         },
//         {
//             "quote": "The 2026 FIFA World Cup will be jointly hosted by the United States, Mexico, and Canada.",
//             "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHZiLoJ3qle_GeEbvsQQpGu_w1yNzLPhXBAFMhWa98EmcQEBU_OoZQAnRhxAWomffH8WU3j_i4KgyKAmm71l3Mry8ebd8xbHIgWee4jr4f-18H_3l_0VbKNPfV45ndYt2a_T6DpjVNu0NLfPHq6zQ=="
//         },
//         {
//             "quote": "For the first time in history, the organisation of the biggest football tournament on the planet will be divided among three countries - Canada, Mexico and the USA - with 16 cities in total hosting matches.",
//             "source": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHpFhSqiu6zzSNgpR40gLxQwOfZBZKYUt8GwZjsj3HWuDJRg8vf4aIon-JOOckIEuQQFUoZo9QFNwSS4SXK9PzRH1gc7nlHyvj_R3ereXz7dlJjgLY2ZF1XsvY3ek7Epj_Co-8pxOOtdu6-F5jLBSUYbvFbgu-EP7eqD74xKSCvE6FuZNIMrLeqQyEzFCekPjD2_WTW8X6pu4rqtKjRVUuxDlaYRpG7S76ihMIzMmw2NJRxgUcnunR89T506P1sEMtAwg=="
//         }
//     ],
//     "recommended_actions": "Correct the host country and the number of host cities for the 2026 FIFA World Cup.",
//     "reasoning": "The headline incorrectly states that Qatar will host the 2026 World Cup. The 2026 FIFA World Cup will be jointly hosted by the United States, Canada, and Mexico. Furthermore, the tournament will take place across 16 cities, not 10, in these three North American countries. While the tournament will feature matches daily as part of its expanded 104-match schedule over 39 days, the core information regarding the host nation and number of cities is inaccurate."
// };
    
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center space-y-4">

        {/* Headline */}
        <div className="text-2xl">
          <p>News</p>
        </div>

        {/* Verdict */}
        <div className="text-2xl">
          <p>This news is {contents.verdict}</p>
        </div>

        {/* Confidence */}
        <div className="my-4">
          <div className="relative w-60 bg-gradient-to-r from-red-500 to-green-500 h-4 rounded-full">
            {/* Pointer */}
            <div
              className="absolute top-0 w-2 h-6 bg-white rounded-full shadow-md"
              style={{
                left:
                  contents.verdict === "false"
                    ? `${(100 - contents.confidence * 100) / 3}%` // left side
                    : contents.verdict === "true"
                    ? `${(200 + contents.confidence * 100) / 3}%` // right side
                    : `${(200 - contents.confidence * 100) / 3}%`, // misleading stays in middle
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        </div>

        {/* Evidence */}
        <div>
          <p className="font-semibold">Evidence:</p>
          <div className="flex flex-col space-y-2">
            {contents.evidence.map((item, index) => (
              <div key={index} className="flex flex-row space-x-2">
                <span className="font-semibold">{index + 1}.</span>
                <span>
                  {item.quote}{" "}
                  <a
                    href={item.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    Link
                  </a>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div>
          <p className="font-semibold">Recommended Actions:</p>
          <p>{contents.recommended_actions}</p>
        </div>

        {/* Reasoning */}
        <div>
          <p className="font-semibold">Reasoning:</p>
          <p>{contents.reasoning}</p>
        </div>
      </div>
    </div>
  )
}

export default Container;