# Семейное древо

A classic top-to-bottom family tree chart. Built with Vite, React and TypeScript, and drawn as SVG.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/ — host anywhere
```

## Adding someone

Add one line to `src/data/family.ts`:

```ts
{ id: 'sagyn-son', name: 'Имя Осмоналиев', gender: 'm', parents: ['sagyn', 'sagyn-wife'] },
```

- `parents`: decides the row and where the line comes from (between both parents).
- `partners`: links a spouse; several spouses are allowed (as with Жанибек Маматов).
- `extra`: small grey text for things without their own box, e.g. `'жена · 4 детей'`.
- Siblings appear in the same order as in the file.

Rows, positions and lines are calculated automatically. Brothers and sisters with no children
of their own are listed vertically to keep the chart narrow. A typo in an id shows a red warning
bar at the top of the page.

Click a name to highlight that person's parents, grandparents, children, grandchildren and spouses.
