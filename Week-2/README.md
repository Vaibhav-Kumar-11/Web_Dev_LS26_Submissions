# Week 2 — Mini Food Ordering Hub

A small React + Vite app: browse a food menu, add items to a cart, and watch quantity, item count, and total price update live — no page reloads, no manual recalculation.

## What it does
- Renders a menu grid from a single data array (`src/data/menuItems.js`) — no item is hardcoded into JSX.
- Clicking "Add to Cart" either creates a new cart row or bumps an existing item's quantity.
- Cart sidebar shows each item with a `+`/`-` stepper; decrementing to 0 removes the item.
- Total price and total item count are **derived** from the cart array on every render (`reduce`), never stored as separate state — so they can never drift out of sync with the actual cart.
- A search bar filters the menu grid in real time.
- Cart persists across page refreshes via `localStorage`, synced through `useEffect`.

## Design decisions
- **Plain CSS, no Tailwind/UI library.** Keeps every style rule something I wrote and can explain, rather than a utility class I'd have to look up.
- **Emoji instead of food photos.** Avoids hunting for/licensing images; the data file is structured so swapping in real `<img>` URLs later is a one-line change per item.
- **State lives in `App.jsx`**, not in the sidebar or the cards — this is "lifting state up." `FoodCard` triggers add events but never holds cart data itself; `App` owns the cart and passes data + handler functions down as props.
- **No separate "remove" button** — quantity hitting 0 removes the item automatically, one less code path to maintain.

## Tech stack
React 19, Vite, plain CSS. No backend — cart state resets on refresh (in-memory only, by design, to keep scope to the assignment's actual ask).

## Run locally
```bash
npm install
npm run dev
```

## File structure
```
food-ordering-hub/
├── src/
│   ├── data/menuItems.js     # menu data — single source of truth
│   ├── components/
│   │   ├── FoodCard.jsx
│   │   ├── MenuGrid.jsx
│   │   └── CartSidebar.jsx
│   ├── App.jsx                # owns cart state + handlers
│   └── index.css
```