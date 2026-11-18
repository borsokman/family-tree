import { useEffect, useMemo, useRef, useState } from "react";
import { family } from "./data/family";
import { config } from "./config";
import { computeLayout, validateFamily } from "./lib/layout";
import { Connectors } from "./components/Connectors";
import { PersonBox } from "./components/PersonBox";
import { PhotoPreview, type PreviewState } from "./components/PhotoPreview";

/** Everyone directly related to `id`: ancestors, descendants and their spouses. */
function relatedTo(id: string, couples: Array<[string, string]>) {
  const byId = new Map(family.map((p) => [p.id, p]));
  const spouses = (x: string) =>
    couples.flatMap(([a, b]) => (a === x ? [b] : b === x ? [a] : []));
  const out = new Set<string>([id, ...spouses(id)]);
  const up = [id];
  while (up.length) {
    for (const p of byId.get(up.pop()!)?.parents ?? [])
      if (!out.has(p)) (out.add(p), up.push(p));
  }
  const down = [id];
  while (down.length) {
    const cur = down.pop()!;
    for (const c of family) {
      if (c.parents?.includes(cur) && !out.has(c.id)) {
        out.add(c.id);
        down.push(c.id);
        spouses(c.id).forEach((s) => out.add(s));
      }
    }
  }
  return out;
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const problems = useMemo(() => validateFamily(family), []);
  const layout = useMemo(() => computeLayout(family), []);
  const related = useMemo(
    () => (selectedId ? relatedTo(selectedId, layout.couples) : null),
    [selectedId, layout],
  );

  // Start zoomed out so the shape is visible, but never so small that names are unreadable.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.clientWidth > 0)
      setScale(Math.max(0.6, Math.min(1, (el.clientWidth - 8) / layout.width)));
  }, [layout.width]);

  const generations =
    Math.max(...[...layout.placed.values()].map((p) => p.generation)) + 1;

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>{config.title}</h1>
          <p>
            {family.length} киши · {generations} муун
          </p>
        </div>
        <div className="header__tools">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            aria-label={theme === "dark" ? "Жарык тема" : "Караңгы тема"}
            title={theme === "dark" ? "Жарык тема" : "Караңгы тема"}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <div className="zoom" role="group" aria-label="Масштаб">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.2, s / 1.25))}
              aria-label="Кичирейтүү"
            >
              −
            </button>
            <button type="button" onClick={() => setScale(1)}>
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(2, s * 1.25))}
              aria-label="Чоңойтуу"
            >
              +
            </button>
          </div>
        </div>
      </header>

      {problems.length > 0 && (
        <div className="app__warning" role="alert">
          Текшериңиз <code>src/data/family.ts</code>: {problems.join("; ")}
        </div>
      )}

      <main
        className="tree-scroll"
        ref={scrollRef}
        onClick={() => setSelectedId(null)}
        onScroll={() => setPreview(null)}
      >
        <svg
          className="tree"
          width={layout.width * scale}
          height={layout.height * scale}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
        >
          <Connectors layout={layout} />
          {[...layout.placed.values()].map((p) => (
            <PersonBox
              key={p.person.id}
              placed={p}
              highlighted={p.person.id === selectedId}
              dimmed={!!related && !related.has(p.person.id)}
              onSelect={(id) =>
                setSelectedId((cur) => (cur === id ? null : id))
              }
              onHover={(rect) =>
                setPreview(rect && p.person.photo ? { person: p.person, rect } : null)
              }
            />
          ))}
        </svg>
      </main>
      <PhotoPreview preview={preview} />
      <footer className="app__hint"></footer>
    </div>
  );
}
