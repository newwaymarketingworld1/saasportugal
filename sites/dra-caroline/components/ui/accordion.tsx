"use client";

// Base: 21st.dev/wensity/accordion (Base UI). Estilo de demo removido;
// tokens do site aplicados. Sem cards, sem sombra, sem fundo.

import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  multiple?: boolean;
  /** Para multiple=false: impede fechar o único item aberto. */
  collapsible?: boolean;
  defaultValue?: string[];
  children: React.ReactNode;
}

export function Accordion({
  multiple = false,
  collapsible = true,
  defaultValue = [],
  className,
  children,
  ...props
}: AccordionProps) {
  const [value, setValue] = React.useState<string[]>(defaultValue);

  return (
    <BaseAccordion.Root
      multiple={multiple}
      value={value}
      // Painéis fechados ficam no DOM com hidden="until-found":
      // a busca do navegador (Ctrl+F) e os buscadores encontram o conteúdo.
      hiddenUntilFound
      onValueChange={(next: string[]) => {
        if (!multiple && !collapsible && next.length === 0) return;
        setValue(next);
      }}
      className={cn("flex flex-col border-t border-line", className)}
      {...props}
    >
      {children}
    </BaseAccordion.Root>
  );
}

export function AccordionItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <BaseAccordion.Item value={value} className={cn("border-b border-line", className)}>
      {children}
    </BaseAccordion.Item>
  );
}

// Accordion.Header renderiza um <h3>.
export function AccordionTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <BaseAccordion.Header className="m-0 flex">
      <BaseAccordion.Trigger
        className={cn(
          "group/trigger flex min-h-14 w-full flex-1 items-center justify-between gap-4 py-4 text-left",
          "font-sans font-semibold text-ink",
          className,
        )}
      >
        <span className="flex-1">{children}</span>
        <Plus
          size={22}
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0 text-sea transition-transform duration-[250ms] ease-out group-data-[panel-open]/trigger:rotate-45 motion-reduce:transition-none"
        />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export function AccordionContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <BaseAccordion.Panel
      className={cn(
        "h-[var(--accordion-panel-height)] overflow-hidden",
        "transition-[height] duration-[250ms] ease-out",
        "data-[starting-style]:h-0 data-[ending-style]:h-0",
      )}
    >
      <div className={cn("pb-6", className)}>{children}</div>
    </BaseAccordion.Panel>
  );
}
