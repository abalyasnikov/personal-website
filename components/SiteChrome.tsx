"use client";

import { useEffect, useState } from "react";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("site-theme", theme);
}

export function SiteChrome() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // The inline head script already resolved the theme before the first paint.
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <div className="site-controls">
      <button className="theme-toggle" type="button" onClick={toggleTheme}>
        {theme === "dark" ? "light" : "dark"}
      </button>
    </div>
  );
}
