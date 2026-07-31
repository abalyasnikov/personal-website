"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

// The inline script in <head> resolves the theme before the first paint, so the
// document element owns the value and this component only reflects it.
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function SiteChrome() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("site-theme", next);
  };

  return (
    <div className="site-controls">
      <button className="theme-toggle" type="button" onClick={toggleTheme}>
        {theme === "dark" ? "light" : "dark"}
      </button>
    </div>
  );
}
