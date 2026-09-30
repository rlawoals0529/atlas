# Product Analytics Case Study

## Goal

Use the curated Input Atlas mouse catalog as a structured product dataset and demonstrate a professional product-analysis workflow without pretending the dataset represents total market share.

The portfolio question is not "which mouse is best?" It is:

> What does the current product set tell us about category concentration, pricing, positioning and unanswered customer questions?

## Dataset

The analysis uses current mouse records from the canonical Atlas catalog. Relevant fields include:

- product status;
- brand and model;
- MSRP when known;
- weight and dimensions;
- shape classification;
- polling ceiling;
- connectivity;
- switches, sensor and configuration capabilities;
- evidence provenance and confidence.

The dataset is curated rather than exhaustive. Every conclusion must therefore be phrased as a finding about the Atlas sample unless additional market-wide evidence is collected.

## Analysis workflow

1. Define the business/product question.
2. Filter to current products.
3. Describe distributions before creating recommendations.
4. Segment weight, MSRP, shape and polling support.
5. Check whether apparently premium specifications are associated with higher MSRP.
6. Identify sparse combinations as hypotheses, not automatic product opportunities.
7. List missing evidence needed for a product decision, such as sales, customer sentiment, returns, reliability or willingness-to-pay data.
8. Separate descriptive findings, hypotheses and recommendations.

## Current UI outputs

The Research Lab computes and displays:

- current catalog count;
- median weight;
- median MSRP for priced current records;
- wireless share;
- share supporting 4K polling or above;
- evidence-health average;
- weight, MSRP, polling and shape distributions;
- most represented brands;
- sparse shape-by-weight cells;
- the average MSRP difference between 4K+ and lower-polling groups when both groups have priced records.

## Interpretation rules

A sparse segment is not automatically a market gap. It may reflect:

- Atlas curation;
- low consumer demand;
- manufacturing constraints;
- poor economics;
- a genuinely underserved segment;
- incomplete source coverage.

A higher average MSRP among 4K+ mice is an association. It does not establish that polling capability causes the price difference because premium mice may also differ in materials, weight, wireless hardware, brand positioning and included accessories.

## What would make this analysis stronger professionally

The next evidence layers would be:

- sales or retailer ranking data;
- price history rather than MSRP alone;
- structured review/community sentiment;
- return/reliability data;
- customer hand size and grip segments;
- controlled product-testing data;
- launch dates and lifecycle stage.

Those additions would allow Atlas to progress from category description toward stronger product opportunity sizing and prioritization.

## Interview framing

This case is intended to demonstrate that the analyst can:

- turn technical product fields into business questions;
- avoid overclaiming from incomplete data;
- segment a category;
- communicate uncertainty;
- distinguish correlation from causation;
- identify the next evidence needed before making a product recommendation.
