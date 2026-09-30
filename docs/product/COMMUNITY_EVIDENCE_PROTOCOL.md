# Community / customer evidence protocol

## Purpose

Atlas can eventually incorporate enthusiast feedback without converting anecdotes into market-wide claims. This protocol defines the evidence model before any broad ingestion begins.

## Evidence record

Every community/customer observation must retain:

- Atlas product ID;
- product attribute being discussed;
- sentiment (`positive`, `mixed`, `negative`, `neutral`);
- source ID, URL, label and source type;
- publication date when known and Atlas observation date;
- concise summary;
- short verbatim quote only when legally/ethically appropriate, otherwise a paraphrase;
- conditions that materially affect the observation (hand/grip context, firmware, surface, batch/revision, region, etc.) when actually known;
- evidence strength;
- sample size when the source provides one;
- a disagreement/consensus indicator.

## Strength is not sentiment

`EvidenceStrength` describes how much support an observation has, not whether it is positive or negative:

- `anecdotal`: one person's experience or one isolated report;
- `repeated-observation`: multiple traceable observations, still potentially self-selected;
- `structured-sample`: a defined sample/method is available;
- `independent-measurement`: the claim is backed by an external measurement rather than sentiment alone.

## Consensus labels

- `single-source`: only one traceable source is represented;
- `disagreement`: meaningful conflicting observations exist;
- `directional`: multiple sources point similarly, but representativeness is not established;
- `cross-source-consensus`: multiple source types support a similar observation and the underlying records remain traceable.

Even `cross-source-consensus` is **not representative market research** and is not equivalent to population sentiment or market share.

## Collection rules

1. Prefer a small, inspectable sample before scaling ingestion.
2. Do not store usernames or other personal identifiers when they are unnecessary to the product question.
3. Do not turn a Reddit thread count into a percentage of customers.
4. Preserve negative/disconfirming observations rather than selecting only evidence that matches an existing hypothesis.
5. Treat product revision, firmware, receiver, software, pad/surface and user context as potential moderators when actually known.
6. Keep summaries close to the source and distinguish a quote from a paraphrase.
7. Keep manufacturer claims, independent measurements and community observations in separate evidence classes.
8. Never silently promote community feedback into canonical catalog specifications.

## Aggregation

Atlas may aggregate traceable records by product + attribute to show:

- observation counts by sentiment;
- number of unique sources;
- number of source types;
- disagreement/consensus state.

The UI must state that these are observations in the curated Atlas evidence set, not a representative survey.

## What evidence is still needed for product decisions

Community evidence can reveal questions worth investigating, recurring failure modes and vocabulary users employ. Decisions about demand, market opportunity, quality rates or willingness to pay still require stronger evidence such as representative research, production behavior, sales/returns data, controlled experiments or real validation measurements.
