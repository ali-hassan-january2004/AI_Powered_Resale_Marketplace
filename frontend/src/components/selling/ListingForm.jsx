import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { COLORS, CONDITIONS, SIZES } from "../../utils/constants";
import { getListingDraft } from "../../api/ai";
import ImageUploader from "./ImageUploader";
import AIDraftPanel from "./AIDraftPanel";
import ConditionSelect from "./ConditionSelect";
import PriceInput from "./PriceInput";
import Button from "../ui/Button";

const schema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  description: z.string().trim().min(20, "Describe the item in at least 20 characters").max(2000),
  category: z.string().min(1, "Choose a category"),
  brand: z.string().trim().min(1, "Enter a brand (or 'Unbranded')").max(50),
  size: z.string().min(1, "Choose a size"),
  color: z.string().min(1, "Choose a color"),
  condition: z.string().min(1, "Select the condition"),
  price: z.coerce.number().positive("Price must be greater than 0").max(10000000),
});

const flatten = (list = []) => list.flatMap((c) => [c, ...flatten(c.children || [])]);

const inputCls = "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20";

function Field({ label, error, children, htmlFor }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// onSubmit(values, images, { draft: boolean }) must return a promise.
// images: [{ id, url, file?, isCover }]
export default function ListingForm({ initialValues, initialImages = [], categories = [], onSubmit, submitLabel = "Publish listing" }) {
  const [images, setImages] = useState(initialImages);
  const [imageError, setImageError] = useState("");
  const [saving, setSaving] = useState(null); // "publish" | "draft" | null
  const [serverError, setServerError] = useState("");
  const flatCategories = flatten(categories);

  const {
    register, control, handleSubmit, setValue, getValues, setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "", description: "", category: "", brand: "", size: "", color: "", condition: "", price: "",
      ...initialValues,
    },
  });

  const run = async (values, draft) => {
    setServerError("");
    setSaving(draft ? "draft" : "publish");
    try {
      await onSubmit(values, images, { draft });
    } catch (e) {
      setServerError(e.message);
    } finally {
      setSaving(null);
    }
  };

  const publish = handleSubmit((values) => {
    if (images.length < 1) {
      setImageError("Add at least one photo.");
      return;
    }
    setImageError("");
    return run(values, false);
  });

  const saveDraft = () => {
    const values = getValues();
    if (!values.title?.trim()) {
      setError("title", { message: "Add a title so you can find this draft later" });
      return;
    }
    return run(values, true);
  };

  const applyAI = (v) => {
    const opts = { shouldValidate: true, shouldDirty: true };
    if (v.title) setValue("title", v.title, opts);
    if (v.description) setValue("description", v.description, opts);
    if (v.brand) setValue("brand", v.brand, opts);
    if (v.price) setValue("price", v.price, opts);
    if (v.condition && CONDITIONS.some((c) => c.value === v.condition)) setValue("condition", v.condition, opts);
    if (v.color && COLORS.some((c) => c.name === v.color.toLowerCase())) setValue("color", v.color.toLowerCase(), opts);
    if (v.categoryLabel) {
      const match = flatCategories.find((c) => c.name.toLowerCase() === v.categoryLabel.toLowerCase());
      if (match) setValue("category", match._id, opts);
    }
  };

  return (
    <form onSubmit={publish} noValidate className="space-y-8">
      <section>
        <h2 className="mb-1 text-lg font-semibold">1. Add photos</h2>
        <p className="mb-3 text-sm text-stone-600">Clear, well-lit photos sell faster. The first photo is your cover.</p>
        <ImageUploader value={images} onChange={(v) => { setImages(v); setImageError(""); }} error={imageError} />
      </section>

      <AIDraftPanel
        disabled={images.length === 0}
        onRequestDraft={() => getListingDraft(images.map((i) => i.url))}
        onApply={applyAI}
      />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">2. Item details</h2>

        <Field label="Title" htmlFor="title" error={errors.title?.message}>
          <input id="title" {...register("title")} maxLength={100} className={inputCls} placeholder="e.g. Black leather biker jacket" />
        </Field>

        <Field label="Description" htmlFor="description" error={errors.description?.message}>
          <textarea id="description" rows={5} {...register("description")} maxLength={2000} className={inputCls}
            placeholder="Fit, material, flaws, measurements…" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" htmlFor="category" error={errors.category?.message}>
            <select id="category" {...register("category")} className={inputCls}>
              <option value="">Select…</option>
              {flatCategories.filter((c) => c.isActive !== false).map((c) => (
                <option key={c._id} value={c._id}>{c.parent ? "— " : ""}{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Brand" htmlFor="brand" error={errors.brand?.message}>
            <input id="brand" {...register("brand")} className={inputCls} />
          </Field>
          <Field label="Size" htmlFor="size" error={errors.size?.message}>
            <select id="size" {...register("size")} className={inputCls}>
              <option value="">Select…</option>
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Color" htmlFor="color" error={errors.color?.message}>
            <select id="color" {...register("color")} className={`${inputCls} capitalize`}>
              <option value="">Select…</option>
              {COLORS.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </Field>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium">Condition</p>
          <Controller name="condition" control={control}
            render={({ field }) => <ConditionSelect value={field.value} onChange={field.onChange} error={errors.condition?.message} />} />
        </div>

        <div className="max-w-xs">
          <Field label="Price" htmlFor="price">
            <Controller name="price" control={control}
              render={({ field }) => <PriceInput id="price" value={field.value} onChange={field.onChange} error={errors.price?.message} />} />
          </Field>
        </div>
      </section>

      {serverError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={saving === "publish"} disabled={!!saving}>{submitLabel}</Button>
        <Button type="button" variant="secondary" loading={saving === "draft"} disabled={!!saving} onClick={saveDraft}>
          Save as draft
        </Button>
      </div>
    </form>
  );
}