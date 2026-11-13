import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "../../features/orders/checkoutSchemas";

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20";

export default function AddressForm({ defaultValues, onSubmit, onCancel, submitLabel = "Save address", showDefault = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: "", line1: "", city: "", region: "", postalCode: "", country: "", isDefault: false, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <Field label="Label (optional)" error={errors.label?.message}>
        <input {...register("label")} placeholder="Home, Office…" className={inputCls} />
      </Field>
      <Field label="Street address" error={errors.line1?.message}>
        <input {...register("line1")} autoComplete="address-line1" className={inputCls} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="City" error={errors.city?.message}>
          <input {...register("city")} autoComplete="address-level2" className={inputCls} />
        </Field>
        <Field label="State / Province" error={errors.region?.message}>
          <input {...register("region")} autoComplete="address-level1" className={inputCls} />
        </Field>
        <Field label="Postal code" error={errors.postalCode?.message}>
          <input {...register("postalCode")} autoComplete="postal-code" className={inputCls} />
        </Field>
        <Field label="Country" error={errors.country?.message}>
          <input {...register("country")} autoComplete="country-name" className={inputCls} />
        </Field>
      </div>
      {showDefault && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isDefault")} className="accent-emerald-600" />
          Make this my default address
        </label>
      )}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg border border-stone-300 px-4 py-2 text-sm hover:bg-stone-50">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}