"use client";

import { useEffect, useState } from "react";

const accents = [
  { name: "vermilion", value: "#ff4d2e" },
  { name: "signal blue", value: "#4f7cff" },
  { name: "acid", value: "#c8ff38" },
  { name: "pine", value: "#45b36b" },
  { name: "pink", value: "#ff5c93" },
];

const treatments = ["script", "mono", "underline"] as const;
type Treatment = (typeof treatments)[number];
const defaultAccent = 1;

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("site-theme", theme);
}

export function SiteChrome() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [accent, setAccent] = useState(defaultAccent);
  const [treatment, setTreatment] = useState<Treatment>("script");
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("site-theme");
    const storedAccentValue = localStorage.getItem("accent");
    const storedAccent = storedAccentValue === null ? Number.NaN : Number(storedAccentValue);
    const storedTreatment = localStorage.getItem("accent-treatment") as Treatment | null;
    const initialTheme = storedTheme === "dark" ? "dark" : "light";
    const initialAccent = Number.isInteger(storedAccent) && storedAccent >= 0 && storedAccent < accents.length ? storedAccent : defaultAccent;
    const initialTreatment = storedTreatment && treatments.includes(storedTreatment) ? storedTreatment : "script";

    setTheme(initialTheme);
    setAccent(initialAccent);
    setTreatment(initialTreatment);
    applyTheme(initialTheme);
    document.documentElement.style.setProperty("--accent", accents[initialAccent].value);
    document.documentElement.dataset.accentStyle = initialTreatment;
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  const chooseAccent = (index: number) => {
    setAccent(index);
    document.documentElement.style.setProperty("--accent", accents[index].value);
    localStorage.setItem("accent", String(index));
  };

  const chooseTreatment = (next: Treatment) => {
    setTreatment(next);
    document.documentElement.dataset.accentStyle = next;
    localStorage.setItem("accent-treatment", next);
  };

  return (
    <>
      <div className="site-controls">
        <button className="theme-toggle" type="button" onClick={toggleTheme}>
          {theme === "dark" ? "light" : "dark"}
        </button>
      </div>

      <button
        className="picker-toggle"
        type="button"
        aria-expanded={pickerOpen}
        aria-controls="accent-picker"
        onClick={() => setPickerOpen((open) => !open)}
      >
        style
      </button>

      <div id="accent-picker" className="accent-picker" aria-label="Accent preview controls" hidden={!pickerOpen}>
        <span className="picker-label">accent</span>
        <div className="swatches">
          {accents.map((item, index) => (
            <button
              key={item.name}
              type="button"
              className="swatch"
              style={{ "--swatch": item.value } as React.CSSProperties}
              aria-label={item.name}
              aria-pressed={accent === index}
              onClick={() => chooseAccent(index)}
            />
          ))}
        </div>
        <div className="treatments">
          {treatments.map((item) => (
            <button key={item} type="button" aria-pressed={treatment === item} onClick={() => chooseTreatment(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
