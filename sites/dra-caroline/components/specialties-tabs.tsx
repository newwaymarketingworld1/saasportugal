"use client";

// Estrutura inspirada em 21st.dev/felipemenezes098/feature-01 (lista que troca
// o conteúdo ao selecionar). Reconstruída como abas acessíveis, seguindo o
// wireframe: índice à esquerda, painel à direita, crossfade de 200ms.

import { useRef, useState, type KeyboardEvent } from "react";
import { specialties } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ConditionList } from "./condition-list";

export function SpecialtiesTabs() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = specialties.areas.length;

  const focusTab = (index: number) => {
    const next = (index + total) % total;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(total - 1);
        break;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-x-8">
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label={specialties.title}
        className="col-span-5 flex flex-col border-t border-line"
      >
        {specialties.areas.map((area, i) => {
          const selected = i === active;
          return (
            <button
              key={area.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`tab-${area.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${area.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "relative border-b border-line py-4 pr-4 pl-6 text-left text-[1.125rem] leading-[1.45] font-semibold",
                "transition-colors duration-150",
                selected ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-3 bottom-3 left-0 w-[3px] bg-sea transition-opacity duration-150",
                  selected ? "opacity-100" : "opacity-0",
                )}
              />
              {area.title}
            </button>
          );
        })}
      </div>

      {/* Todos os painéis ocupam a mesma célula do grid: a altura é a do
          maior painel e a página não "pula" ao trocar. */}
      <div className="col-span-6 col-start-7 grid">
        {specialties.areas.map((area, i) => {
          const selected = i === active;
          return (
            <div
              key={area.id}
              id={`panel-${area.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${area.id}`}
              tabIndex={selected ? 0 : -1}
              aria-hidden={!selected}
              className={cn(
                "[grid-area:1/1] transition-[opacity,visibility] duration-200 ease-out",
                selected ? "visible opacity-100" : "invisible opacity-0",
              )}
            >
              <h3 className="font-sans text-[1.5rem] leading-[1.3] font-semibold text-ink">{area.title}</h3>
              <p className="t-body mt-3 text-muted">{area.description}</p>
              <div className="mt-8 border-t border-line pt-6">
                <ConditionList area={area} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
