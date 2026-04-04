# Design System Strategy: The Curated Home

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **"The Digital Sanctuary."** 

Moving beyond a utilitarian cleaning service website, this system adopts a high-end editorial approach. It translates the Swedish philosophy of *Lagom*—not too much, not too little, just right—into a digital interface. We achieve a premium feel by breaking the traditional, rigid grid through **intentional asymmetry**, heavy use of **whitespace (the "breathing room")**, and **tonal layering**. Elements should feel like they are placed thoughtfully within a physical space, utilizing overlapping imagery and floating surfaces to mimic the clean, airy atmosphere of a modern Nordic interior.

## 2. Colors: Tonal Depth & Warm Accents
Our palette avoids the harshness of pure digital black. Instead, it uses a sophisticated range of grays and a signature vibrant orange to provide life and direction.

### The "No-Line" Rule
To maintain a high-end aesthetic, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined solely through background color shifts. For example, a content section using `surface-container-low` should sit against a `surface` background to define its edges.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to create depth:
*   **Base:** `surface` (#f9f9f9) for the primary page background.
*   **Nesting:** Place `surface-container-lowest` (#ffffff) cards on top of a `surface-container` (#eeeeee) section to create a "lifted" effect without heavy shadows.

### The Glass & Gradient Rule
*   **Glassmorphism:** For floating navigational elements or secondary CTAs, use semi-transparent surface colors (80% opacity) with a `backdrop-blur` of 20px.
*   **Signature Textures:** Use a subtle linear gradient from `primary` (#2c5f5d) to `primary-container` (#ff7e33) at a 135-degree angle for main CTAs. This adds a "glow" that flat hex codes cannot replicate, echoing sunlight hitting a surface.

## 3. Typography: Editorial Authority
The typography system uses a pairing of **Manrope** for architectural headlines and **Plus Jakarta Sans** for functional, modern body text.

*   **Display & Headlines (Manrope):** These are our "anchors." Use `display-lg` for hero sections with tight letter-spacing (-0.02em) to create a bold, editorial look.
*   **Body & Titles (Plus Jakarta Sans):** Chosen for its high x-height and readability. `body-lg` is the standard for narrative content, ensuring the "minimalist" look doesn't sacrifice legibility.
*   **Hierarchy as Identity:** Use `label-md` in all-caps with increased letter-spacing (+0.1em) for category tags to provide a premium, boutique feel.

## 4. Elevation & Depth: Atmospheric Layering
Depth in this system is achieved through light and layering, not structural lines.

*   **The Layering Principle:** Stack `surface-container` tiers to create natural hierarchy. A `surface-container-highest` element against a `surface` background indicates maximum interactive priority.
*   **Ambient Shadows:** When a float is required (e.g., a "Book Now" floating card), use a shadow with a 40px blur, 10px Y-offset, and only 4% opacity using a tint of `on-surface` (#1a1c1c). It should feel like a soft "glow" of shadow, not a dark smudge.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` (#dfc0b3) at **15% opacity**. This creates a suggestion of a container rather than a hard cage.
*   **Glassmorphism:** Use `surface_container_lowest` at 70% opacity with a blur effect for mobile navigation and sticky headers to allow the "clean interiors" imagery to bleed through.

## 5. Components

### Buttons
*   **Primary:** Uses the Signature Gradient (`primary` to `primary-container`). Roundedness: `full`. Padding: `spacing-3` (top/bottom) by `spacing-6` (left/right).
*   **Secondary:** `surface-container-lowest` background with a `primary` text color. No border. Soft ambient shadow on hover.
*   **Tertiary:** Transparent background, `on-surface` text with an underline that expands from the center on hover.

### Cards & Lists
*   **The Divider Ban:** Strictly forbid 1px dividers. Separate list items using `spacing-4` vertical gaps or alternating background shades between `surface` and `surface-container-low`.
*   **Cards:** Use `rounded-lg` (1rem). Ensure images within cards have a slight zoom-on-hover effect to add a layer of premium interactivity.

### Input Fields
*   **Style:** Minimalist. Background `surface-container-low`. No border except for a 2px `primary` bottom-border that appears only on focus.
*   **Error State:** Use `error` text and an `error_container` background tint for the field.

### Signature Component: The "Service Carousel"
Instead of a grid, use an asymmetric carousel where the active card is `display-md` in width and inactive cards are `display-sm`, creating a sense of movement and "curation."

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a functional element. If a section feels "busy," double the spacing using `spacing-20` or `spacing-24`.
*   **DO** overlap elements. Let a high-quality interior photo partially underlap a `surface-container-lowest` text card to create 3D depth.
*   **DO** use high-contrast imagery. Photos should be over-exposed slightly to emphasize the "clean white" brand pillar.

### Don't
*   **DON'T** use pure black (#000000) for text. Use `on-surface` (#1a1c1c) to keep the Nordic softness.
*   **DON'T** use 1px borders to separate content sections. Use tonal shifts.
*   **DON'T** use "heavy" shadows. If the shadow is clearly visible as a dark line, the opacity is too high. It should feel like atmospheric light.
*   **DON'T** crowd the edges. Maintain a minimum of `spacing-8` (2.75rem) horizontal padding on all mobile containers.