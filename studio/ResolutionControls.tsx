"use client";

import { useId } from "react";

import styles from "./canvas.module.css";

export type BoardSize = { width: number; height: number; maxHeight?: number };

const presets = [
  { label: "Mobile", width: 390, height: 844 },
  { label: "Tablet", width: 768, height: 1024 },
  { label: "Laptop", width: 1280, height: 800 },
  { label: "Desktop", width: 1440, height: 900 },
];

export function ResolutionControls({
  size,
  onChange,
  onMaxHeightChange,
  maxHeight: sharedMaxHeight,
  label,
}: {
  size?: BoardSize;
  maxHeight?: number;
  onChange: (size: BoardSize) => void;
  label: string;
  onMaxHeightChange?: (height: number | undefined) => void;
}) {
  const fieldId = useId();
  const capHeight = sharedMaxHeight ?? size?.maxHeight;
  const preset = presets.find((item) => item.width === size?.width);
  return (
    <form
      className={styles.resolutionControls}
      key={`${size?.width}-${capHeight}`}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const width = Number(data.get("width"));
        const height = size?.height ?? 720;
        const maxHeight =
          capHeight === undefined ? undefined : Number(data.get("height"));
        if (
          width === 0 &&
          onMaxHeightChange &&
          maxHeight !== undefined &&
          Number.isInteger(maxHeight) &&
          maxHeight >= 240 &&
          maxHeight <= 7680
        ) {
          onMaxHeightChange(maxHeight);
          return;
        }
        if (
          !Number.isInteger(width) ||
          !Number.isInteger(height) ||
          width < 240 ||
          (maxHeight !== undefined &&
            (!Number.isInteger(maxHeight) ||
              maxHeight < 240 ||
              maxHeight > 7680)) ||
          width > 7680 ||
          height > 7680
        ) {
          return;
        }
        onChange({ width, height, maxHeight });
      }}
    >
      <select
        aria-label={`Resolution preset for ${label}`}
        value={preset?.label ?? "custom"}
        onChange={(event) => {
          const selected = presets.find(
            (item) => item.label === event.target.value
          );
          if (selected) {
            onChange({
              width: selected.width,
              height: size?.height ?? selected.height,
              maxHeight: capHeight,
            });
          }
        }}
      >
        <option value="custom">{size ? "Custom width" : "Mixed widths"}</option>
        {presets.map((item) => (
          <option key={item.label} value={item.label}>
            {item.label} · {item.width}px
          </option>
        ))}
      </select>
      <label htmlFor={`${fieldId}-width`}>
        W
        <input
          id={`${fieldId}-width`}
          name="width"
          aria-label={`Width for ${label}`}
          type="number"
          required={!onMaxHeightChange || capHeight === undefined}
          min={240}
          max={7680}
          step={1}
          defaultValue={size?.width}
          placeholder="Mixed"
        />
      </label>
      {capHeight !== undefined && (
        <label htmlFor={`${fieldId}-height`}>
          Max H
          <input
            id={`${fieldId}-height`}
            name="height"
            aria-label={`Max height for ${label}`}
            type="number"
            required
            min={240}
            max={7680}
            step={1}
            defaultValue={capHeight}
            placeholder="Mixed"
          />
        </label>
      )}
      <button
        type="button"
        aria-label={`Toggle max height for ${label}`}
        aria-pressed={capHeight !== undefined}
        onClick={() => {
          const maxHeight =
            capHeight === undefined ? (size?.height ?? 900) : undefined;
          if (onMaxHeightChange) {
            onMaxHeightChange(maxHeight);
            return;
          }
          onChange({
            width: size?.width ?? 1440,
            height: size?.height ?? 720,
            maxHeight,
          });
        }}
      >
        {capHeight === undefined ? "Set max height" : "Full height"}
      </button>
      <button type="submit">Apply</button>
    </form>
  );
}
