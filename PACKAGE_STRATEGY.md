# Package Strategy

This doc defines Swara package types and what “sharing” means in MVP vs roadmap.

## Package Types

- **App shell**: the application UI + logic (no model weights).
- **Survival pack**: offline knowledge bundle (SOPs, checklists, region notes, sources/labels).
- **Model pack**: on-device model runtime package (weights + tokenizer + runtime config).
- **Region pack**: region-specific add-on knowledge (e.g., Jakarta flood-first).
- **Host pack**: host-node bundle for LAN/hotspot/local web mode (partial/roadmap).
- **LoRA adapter**: optional adapter package applied on top of a base model pack.

## MVP Package Sharing (Must Be Visible)

MVP includes a visible “share/import” path for:

- Response sharing (single answer + structured steps)
- Survival pack sharing
- App shell sharing
- Model pack share/import path (works, even if not yet production-grade)

## Roadmap Package Improvements (Robustness)

Production-grade transfer quality is roadmap:

- Compression (production-grade)
- Split chunks / chunked transfer
- Resumable transfers
- Checksums / integrity verification
- Version compatibility checks and migrations
- Battery-aware transfer behavior (throttle/pause)

## Minimal Manifest Fields

All package types should carry a minimal manifest:

- `packageType`
- `name`
- `version`
- `sizeBytes`
- `createdAt` (ISO)
- `checksum`
- `requiredAppVersion`
- `description`

