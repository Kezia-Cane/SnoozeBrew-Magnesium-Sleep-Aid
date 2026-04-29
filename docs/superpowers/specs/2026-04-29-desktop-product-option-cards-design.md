# Desktop Product Option Cards Design

## Goal

Restyle the SnoozeBrew product-option cards on desktop only so they follow the Jiyu desktop card presentation more closely, while keeping SnoozeBrew branding, current selector behavior, and the already-approved mobile/tablet layouts unchanged.

## Scope

This change applies only to the selector card presentation inside the existing purchase module on desktop breakpoints.

In scope:
- Desktop-only visual restyling of the 3 product-option cards
- Desktop-only spacing, sizing, alignment, and selected-state treatment
- Desktop-only badge placement and proportions
- Desktop-only image/copy/price row presentation

Out of scope:
- Rebuilding the overall product hero
- Changing the gallery
- Changing product copy, pricing logic, or selector logic
- Changing the approved mobile/tablet design
- Changing the monthly-toggle behavior

## Reference Source

Use the existing Jiyu local project as the desktop visual reference:
- `C:/Users/Administrator/Documents/My projects/Jiyu/index.html`
- `C:/Users/Administrator/Documents/My projects/Jiyu/styles.css`
- `C:/Users/Administrator/Documents/My projects/Jiyu/script.js`

The reference should guide the desktop card presentation only, not the rest of the SnoozeBrew layout.

## Current SnoozeBrew Constraints

- The SnoozeBrew selector already exists and is functional.
- Mobile and tablet layouts were already adjusted and should remain as-is.
- The first gallery image must remain untouched by the selector.
- SnoozeBrew branding colors and current product content stay in place.

## Proposed Desktop Design

At desktop widths only:

1. The option cards should present as cleaner horizontal offer rows, closer to Jiyu desktop.
2. Each card should feel flatter and more structured, with clearer left-to-right reading:
   - image block
   - offer copy
   - price stack
3. Supply badges should sit in a more Jiyu-like anchored position and feel more integrated with each card.
4. Card padding, border contrast, radius, and spacing should read more like a premium desktop offer selector instead of the current softer stacked block.
5. The selected card should be more visually distinct on desktop through border emphasis and/or stronger contrast.
6. Typography and colors should still read as SnoozeBrew rather than a literal Jiyu clone.

## Implementation Approach

Primary implementation should be CSS-only and desktop-only.

Expected file impact:
- `C:/Users/Administrator/Documents/My projects/Snooze Brew/style.css`

Allowed only if necessary:
- `C:/Users/Administrator/Documents/My projects/Snooze Brew/index.html`
- `C:/Users/Administrator/Documents/My projects/Snooze Brew/script.js`

The preferred implementation is to:
- leave markup and behavior intact
- add or refine desktop breakpoint rules
- avoid touching mobile/tablet breakpoint rules unless a desktop rule accidentally overlaps them

## Interaction Requirements

These behaviors must remain unchanged:
- 3 visible option cards
- monthly toggle switching between one-time and subscription states
- selected card state
- CTA text switching
- no gallery-image override from selector interaction

## Testing Requirements

Verify three viewport classes after implementation:

- Desktop:
  - cards visibly follow the Jiyu-style offer presentation
  - selected state is clear
  - badges align correctly
  - price stack remains readable

- Tablet:
  - existing approved compact layout remains unchanged

- Mobile:
  - existing approved compact layout remains unchanged

## Risks

1. Desktop CSS may accidentally leak into tablet because of overlapping breakpoints.
2. Badge repositioning may collide with price alignment at intermediate desktop widths.
3. Desktop-specific spacing changes may create overflow if the card content becomes too rigid.

## Risk Handling

- Keep all Jiyu-style card presentation changes inside desktop-only media rules.
- Re-verify tablet and mobile after desktop changes.
- Favor targeted overrides on the selector card classes rather than broad product-section rules.

## Success Criteria

The work is successful when:
- desktop selector cards visibly resemble the Jiyu desktop offer-card presentation
- SnoozeBrew branding remains intact
- mobile/tablet presentation does not regress
- current selector logic and gallery behavior remain intact
