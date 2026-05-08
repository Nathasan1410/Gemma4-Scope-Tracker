# QR-Only Payload Formats (Alternatives to Markdown)

Goal: share content **via QR only** (no network), while keeping payload small, robust, and scannable.

## Constraints (What Actually Limits Us)

QR payload size depends on:

- QR **version** (1–40)
- error correction level **L/M/Q/H**
- encoding **mode** (numeric / alphanumeric / byte)

Reference capacity examples:

- Version 40-L can hold up to ~2,953 bytes in **byte mode** (highest capacity class). See References.
- Version 40-L can hold up to ~4,296 characters in **alphanumeric mode**. See References.
- Max capacity depends on version + character type + error correction. See References.

## Phase 2 Recommendation (Practical)

Pick based on payload size + UX:

1) **Single QR, human-readable** → **Option A: Compact Plaintext Card**
2) **Single QR, structured + smaller than JSON** → **Option D-lite: Binary (CBOR) + Base45**
3) **Larger than single QR** → **Multipart UR (CBOR + Bytewords + sequencing)** or **Structured Append** (standards-based)

Why:

- Plaintext cards keep overhead low and remain readable even outside Swara.
- For structured data, encode binary then use an encoding designed for QR constraints (Base45).
- For multi-QR, UR is a mature pattern for “airgapped QR transfer” UX with sequencing.

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

Notes:

- Keep ASCII/uppercase if possible to avoid UTF-8 expansion and to help fit alphanumeric mode constraints.
- Avoid long prose; prefer short steps and codes.

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

- Base64 expands data by ~33% (typical).
- Base45 is designed for QR alphanumeric mode use-cases (RFC 9285).

Why Base45 usually wins for QR:

- Base45 stays inside the QR **alphanumeric** character set, which often yields denser codes than encodings that force **byte mode**.
- Base91 can be more space-efficient on paper, but it uses many punctuation characters; in practice that can reduce portability across scanners/apps and may not map cleanly to QR alphanumeric mode.

Pros:
- smallest payload for structured data
- best for future “import/share” of structured response objects

Cons:
- not human-readable
- needs an app decoder (fine for Swara app import)

## Option E (Multi-QR, Scanner-Friendly): UR (CBOR + Bytewords + Multipart)

UR (Uniform Resources) is a text format designed to transport structured binary data via URIs/QR:

- UR uses **CBOR** and can be converted into **minimal Bytewords**; guidance suggests ALL CAPS for QR efficiency.
- UR supports multipart / sequencing patterns (often used for “animated QRs” in airgapped transfer UX).
 
Pros:

- strong precedent for QR-based transfer of structured data
- works well when payload exceeds a single QR

Cons:

- needs encoder/decoder support in-app
- payload is not human-readable

## Larger Than One QR: Multi-QR Sequences

If payload cannot fit in a single QR:

- Use **Structured Append** (up to 16 symbols) as the standards-based approach.
 - Structured Append is capped (commonly cited as up to 16 symbols).

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

## References

- QR Code capacity overview (version, mode, error correction): `https://www.qrcode.com/en/about/version.html`
- QR 40-L capacity table (including 2,953 bytes, 4,296 alphanumeric): `https://www.thonky.com/qr-code-tutorial/data-encoding`
- Base45 spec (RFC 9285): `https://www.rfc-editor.org/rfc/rfc9285.html`
- UR + Bytewords docs (multipart patterns, minimal encoding guidance): `https://developer.blockchaincommons.com/ur/` and `https://developer.blockchaincommons.com/bytewords/`
- Structured Append limit (up to 16 symbols, ISO/IEC 18004): `https://nuintun.github.io/qrcode/packages/core/spec/ISO-IEC-18004-2015.pdf`
