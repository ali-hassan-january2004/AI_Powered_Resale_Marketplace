export const CONDITIONS = [
  { value: "new_with_tags", label: "New with tags", hint: "Unworn, tags still attached" },
  { value: "like_new", label: "Like new", hint: "Worn once or twice, no flaws" },
  { value: "good", label: "Good", hint: "Gently used, minor signs of wear" },
  { value: "fair", label: "Fair", hint: "Visible wear or small flaws" },
];

export const CONDITION_VALUES = CONDITIONS.map((c) => c.value);

export const conditionLabel = (value) =>
  CONDITIONS.find((c) => c.value === value)?.label ?? value ?? "";