# Atlas v0.9 visual research: point fields, not copied branding

Research date: 2026-09-29

## What “OpenAI dots” refers to now

OpenAI's current public Dots page describes **Dots** as always-on agents powered by GPT-6 Astra. The useful product-design pattern is not a generic claim over dot graphics; it is the combination of persistent state, visible ongoing work, reviewable outputs, user-set boundaries, and clear control over what the system can do.

Primary source: https://chatgpt.com/features/dots/

OpenAI's public brand guidance also makes clear that OpenAI marks and visual identity should be used as prescribed rather than remixed. Atlas should therefore avoid OpenAI logos, mascots, exact motion, layouts, names, or agent styling.

Primary source: https://openai.com/brand/

For interaction craft, OpenAI's public UI guidance emphasizes using visual UI only when it improves the workflow, keeping controls appropriate to their function, and maintaining accessibility/responsiveness.

Primary source: https://developers.openai.com/plugins/concepts/ui-guidelines

## Atlas-native translation

Atlas uses a **catalog constellation** as an information visualization:

- one point equals one real catalog mouse record;
- x/y position encodes sourced weight and MSRP;
- point size encodes the advertised polling tier;
- shape class separates symmetrical and ergonomic mice;
- filtering changes visibility but never changes the underlying record;
- hover/focus reveals the exact product and encoded values;
- sparse regions are presented as research prompts, not opportunities;
- the view is paired with matrix counts and explicit denominators so the visual cannot imply more precision than the catalog contains.

This extends Atlas's existing technical/industrial identity and provenance model. It does not copy OpenAI branding or claim affiliation.

## Design rules

1. Dots must always encode a real field or record; no decorative particle cloud on analytical surfaces.
2. Every chart needs a textual limitation or denominator.
3. Unknown optional fields remain unknown; absence is not silently converted to `false`.
4. Hover and keyboard focus must expose the same product-level context.
5. Motion is optional and reduced-motion preferences take priority.
6. Keep the Product Lab dense and operational rather than turning it into a marketing landing page.
