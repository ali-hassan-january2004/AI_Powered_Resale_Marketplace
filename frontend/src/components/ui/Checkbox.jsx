import { forwardRef, useId } from "react";

const Checkbox = forwardRef(function Checkbox({ label, error, id, className = "", ...rest }, ref) {
  const autoId = useId();
  const boxId = id || autoId;

  return (
    <div className={className}>
      <label htmlFor={boxId} className="flex cursor-pointer items-center gap-2 text-sm">
        <input ref={ref} id={boxId} type="checkbox" className="h-4 w-4 rounded accent-emerald-600" {...rest} />
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Checkbox;