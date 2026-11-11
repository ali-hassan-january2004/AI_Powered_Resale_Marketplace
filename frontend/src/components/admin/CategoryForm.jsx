import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../ui/Button";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(40),
  parent: z.string().optional(),
  icon: z.string().trim().max(30).optional(),
  isActive: z.boolean(),
});

// categories: flat list used for the "parent" dropdown
export default function CategoryForm({ initial, categories = [], onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name || "",
      parent: initial?.parent || "",
      icon: initial?.icon || "",
      isActive: initial?.isActive ?? true,
    },
  });

  const cls = "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20";
  const parents = categories.filter((c) => !c.parent && c._id !== initial?._id);

  const submit = (values) =>
    onSubmit({ ...values, parent: values.parent || null });

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Name</span>
        <input {...register("name")} className={cls} />
        {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Parent category</span>
        <select {...register("parent")} className={cls}>
          <option value="">None (top level)</option>
          {parents.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Icon name (optional)</span>
        <input {...register("icon")} placeholder="e.g. shirt" className={cls} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("isActive")} className="accent-emerald-600" />
        Active (visible to buyers)
      </label>
      <div className="flex gap-2 pt-1">
        <Button type="submit" loading={isSubmitting}>{initial ? "Save changes" : "Create category"}</Button>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}