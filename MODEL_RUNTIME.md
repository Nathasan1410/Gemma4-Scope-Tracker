# Model Runtime (Honest Current State + Targets)

## Selected Model

- **Gemma 4 E2B-it** is selected for strong instruction-following while remaining mobile-feasible.

## Target Runtime (Special Track)

- **LiteRT** is the target runtime for mobile special track deployment.
- Document the prototype honestly: do not claim LiteRT is integrated unless it is.

## Quantization Targets

- Target: **Q4** quantization.
- Optional: **Q3** (only if quality remains safe for emergency guidance).
- Avoid: **Q2** for emergency guidance (riskier degradation).

## Default Generation Settings

- Default output: **512–1024 tokens**.
- “Detailed mode” can be longer, but **4K–8K** is not the default.

## Context

- **64K context** is useful for loading longer SOPs if feasible, but not required for MVP demo.

