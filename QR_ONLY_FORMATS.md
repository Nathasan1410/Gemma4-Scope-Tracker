# QR-Only Payload Formats (Alternatives to Markdown)

Goal: share content **via QR only** (no network), while keeping payload small, robust, and scannable.

## Constraints (What Actually Limits Us)

QR payload size depends on:

- QR **version** (1–40)
- error correction level **L/M/Q/H**
- encoding **mode** (numeric / alphanumeric / byte)

Reference capacity examples:

- Version 40-L can hold up to ~2,953 bytes in **byte mode** (highest capacity class). citeturn0search5turn0search12
- DENSO’s overview explains that max capacity depends on version + character type + error correction. citeturn0search3

## Option A (Best for Humans): Compact Plaintext “Card” Format

Use strict sections + minimal punctuation.

Example:

```
SWARA/1
CAT:FLOOD
REG:JKT
TS:2026-05-08T10:15:00Z
S:MOVE TO HIGH GROUND
S:TURN OFF ELECTRICITY IF SAFE
W:DON'T DRIVE THROUGH FLOODWATER
ESC:IF INJURY/UNCONSCIOUS -> SEEK HELP
```

Pros:
- smallest overhead vs Markdown
- still readable without special tooling

Cons:
- limited richness (no tables/links unless you invent them)

## Option B (Still Human-Friendly): Micro-Markup (Subset)

Define a minimal subset:

- `#` only for title
- `-` only for bullets
- no blank lines, no nested lists, no tables

Pros:
- readable like Markdown
- predictable size

Cons:
- less compact than Option A for the same meaning

## Option C (Best for Machines): Compact JSON (Short Keys)

Example:

```
{"v":1,"cat":"flood","reg":"jkt","ts":"...","s":["..."],"w":["..."]}
```

Pros:
- easy to parse
- stable schema evolution (add fields)

Cons:
- braces/quotes add overhead

## Option D (Most Compact): Binary (CBOR/MessagePack/Protobuf) + QR-Friendly Encoding

Approach:

1) serialize to binary (CBOR / MessagePack / Protobuf)
2) optionally compress (roadmap; see below)
3) encode for QR text

Encoding notes:

- Base64 expands data by ~33%. citeturn0search13
- Base45 is explicitly designed for QR alphanumeric mode use-cases (RFC 9285) and can be a better fit for QR constraints. citeturn0search9turn0search0

Pros:
- smallest payload for structured data
- best for future “import/share” of structured response objects

Cons:
- not human-readable
- needs an app decoder (fine for Swara app import)

## Larger Than One QR: Multi-QR Sequences

If payload cannot fit in a single QR:

- Use **Structured Append** (up to 16 symbols) as the standards-based approach. citeturn0search4turn0search16

Pros:
- QR-only still works
- avoids over-compression tricks for MVP

Cons:
- UX depends on scanner support for sequences

## Roadmap “Make It Robust” (Even If MVP Is Visible)

If you later expand QR payload capability:

- compression
- chunking + resumable transfer
- checksum / integrity validation

These are “robustness” improvements; QR-only MVP should pick a simple, visible, bounded format first.

