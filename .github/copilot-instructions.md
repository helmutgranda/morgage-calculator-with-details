<!-- Copilot instructions for contributors and AI coding agents -->
# Project-specific Copilot Instructions

This is a small single-file web app (single-page) that implements a Mortgage Calculator in `index.html`.
Follow these concise, actionable rules when making edits or generating code for this repo.

1. Big picture
- **Architecture:** single static HTML page (`index.html`) with inline CSS and vanilla JavaScript. No build step, package.json, or server code.
- **UI library:** uses Shoelace Web Components via CDN (`shoelace-autoloader.js` + theme CSS). Interactions are implemented by listening to Shoelace events (e.g., `sl-input`).

2. Key files & anchors (refer to these when generating changes)
- **`index.html`**: the entire app lives here. Modify carefully — many identifiers are referenced by JS.
- Important DOM IDs: `homePrice`, `downPaymentSlider`, `interestRateSlider`, `downPaymentValue`, `interestRateValue`, `detailsBtn`, `details`, `monthlyPayment`, `selectedTerm`.
- Term-specific IDs follow the pattern: `monthly<term>`, `loan<term>`, `interest<term>`, `total<term>` (e.g., `monthly30`, `loan15`). Sl-card elements include `data-term` attributes (e.g., `<sl-card data-term="30">`).

3. Behavior & logic patterns to preserve
- All numeric formatting flows through these functions in `index.html`: `formatCurrency`, `formatInputCurrency`, and `parseInputCurrency`. Reuse them when adding UI or logic that shows numbers.
- Interest and monthly-rate logic: `interestRate` parsed from slider divided by 100, monthly rate is `interestRate / 12`. `calculateForTerm(homePrice, downPaymentPercent, interestRate, term)` returns `{ monthly, loan, interest, total }` — reuse this function for new terms or displays.
- Guard for invalid payment calc: code falls back when `monthlyPayment` is `NaN` or `Infinity`. Preserve that handling when refactoring.

4. Event & DOM conventions
- Shoelace components emit `sl-input` events. Example listeners in `index.html`:
  - `document.getElementById('downPaymentSlider').addEventListener('sl-input', ...)`
  - `document.getElementById('interestRateSlider').addEventListener('sl-input', ...)`
  - `document.getElementById('homePrice').addEventListener('sl-input', ...)`
- Cards use `data-term` and `click` listeners to toggle the `.selected` class. If you add a new term, create the matching DOM elements and ids using the same naming convention.

5. Styling & responsive rules
- Styles are inline in the `<head>`; keep visual changes there unless the user asks to externalize CSS. Responsive grids are controlled via `.details-grid` media queries.

6. Editing guidance (do this, not that)
- Do: When adding a new loan term, add a corresponding `<sl-card data-term="X">` and create `monthlyX`, `loanX`, `interestX`, `totalX` elements. Call `calculateAll()` where appropriate.
- Do: Reuse `formatCurrency` / `parseInputCurrency` for all numeric formatting and parsing.
- Don't: Rename DOM IDs unless you update every JS reference. The code is DOM-driven and brittle to ID changes.
- Don't: Remove the Shoelace CDN lines without replacing the component usage; the UI uses Shoelace tags like `<sl-range>`, `<sl-input>`, `<sl-button>`, `<sl-card>`.

7. Running & debugging
- There is no build or test command. Run by opening `index.html` in a modern browser (Chrome/Edge/Safari) or via a static file server.
- Debug tips: open DevTools → console. Check that elements with IDs in the earlier list exist. Inspect `document.querySelectorAll('sl-card[data-term]')` to verify terms.

8. External deps & compatibility
- External: Shoelace (CDN). Expect modern browsers with ES module support because `shoelace-autoloader.js` is loaded as a module.

9. Examples to copy when generating code
- Add a term card (copy the existing `<sl-card data-term="30" ...>` block and update `data-term`). Create the four corresponding `id` fields using the pattern above.
- Numeric parsing example: use `parseInputCurrency(document.getElementById('homePrice').value)` when reading price inputs.

10. Commit & PR tips for AI contributions
- Keep changes minimal and localized to `index.html` unless adding a new file is required.
- If refactoring JS into separate modules, preserve runtime behavior and include simple instructions in PR description about how to run the page locally.

If anything above is unclear or you want more examples (for instance, adding a new slider or a new term), tell me which change and I will expand the examples or update the instructions.
