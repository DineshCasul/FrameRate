"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { distinctSorted } from "@/lib/utils";

type Props = {
  name: string;
  label: string;
  hint?: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

// Toggleable chips sourced from values already used elsewhere in the data
// (so typo variants like "Open World" vs "Open-world" don't multiply),
// plus a free-text add for anything genuinely new. Used for tags, platform,
// and recommendedFor — all short reusable phrases, unlike pros/cons.
export default function TagPicker({
  name,
  label,
  hint,
  options,
  value,
  onChange,
  placeholder = "Add custom…",
}: Props) {
  const [draft, setDraft] = useState("");

  // Already-selected values (e.g. from editing an older review) still show
  // as active chips even if they've since fallen out of the known-options list.
  const allOptions = useMemo(() => distinctSorted([...options, ...value]), [options, value]);

  function toggle(option: string) {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  }

  function addDraft() {
    const next = draft.trim();
    if (next && !value.includes(next)) onChange([...value, next]);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addDraft();
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1">
        {label}
        {hint && <span className="font-normal text-muted-foreground"> — {hint}</span>}
      </label>

      {allOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {allOptions.map((option) => {
            const selected = value.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggle(option)}
                aria-pressed={selected}
                className={`px-2.5 py-1 rounded-full text-xs sm:text-sm border transition ${
                  selected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-muted"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 bg-transparent text-sm sm:text-base"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addDraft}
          className="border rounded px-3 py-2 text-sm hover:bg-muted transition"
        >
          Add
        </button>
      </div>

      {/* Real form field the server action reads — parsed with linesToArray()
          just like the plain textarea list fields, so actions.ts needs no
          special-casing for these three. */}
      <textarea name={name} value={value.join("\n")} readOnly className="hidden" />
    </div>
  );
}
