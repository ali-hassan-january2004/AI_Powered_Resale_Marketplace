import { useCallback, useEffect, useMemo, useState } from "react";
import { getCategories } from "../../api/categories";
import { createCategory, updateCategory } from "../../api/adminApi";
import CategoryForm from "./CategoryForm";
import Button from "../ui/Button";

// Turns a tree ([{..., children: []}]) or a flat list into a flat list.
const flatten = (list = []) =>
  list.flatMap((c) => [c, ...flatten(c.children || [])]);

export default function CategoryManager() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // category | "new" | null

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTree(await getCategories());
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Load manages its async pending state.
    load();
  }, [load]);

  const flat = useMemo(() => flatten(tree), [tree]);

  const handleSubmit = async (values) => {
    if (editing && editing !== "new") await updateCategory(editing._id, values);
    else await createCategory(values);
    setEditing(null);
    await load();
  };

  const toggleActive = async (c) => {
    await updateCategory(c._id, { isActive: !c.isActive });
    await load();
  };

  if (loading) return <p className="py-8 text-center text-sm text-stone-500">Loading categories…</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-100 p-4">
          <h2 className="font-semibold">Categories</h2>
          <Button size="sm" onClick={() => setEditing("new")}>Add category</Button>
        </div>
        {error && <p className="p-4 text-sm text-red-600">{error}</p>}
        <ul className="divide-y divide-stone-100">
          {flat.map((c) => (
            <li key={c._id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className={c.parent ? "pl-6" : ""}>
                <p className={`text-sm ${c.parent ? "" : "font-medium"} ${c.isActive ? "" : "text-stone-400 line-through"}`}>
                  {c.name}
                </p>
                <p className="text-xs text-stone-500">/{c.slug}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setEditing(c)}>Rename</Button>
                <Button size="sm" variant="ghost" onClick={() => toggleActive(c)}>
                  {c.isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </li>
          ))}
          {!flat.length && <li className="p-6 text-center text-sm text-stone-500">No categories yet.</li>}
        </ul>
      </div>

      {editing && (
        <div className="h-fit rounded-xl border border-stone-200 bg-white p-4">
          <h3 className="mb-3 font-semibold">{editing === "new" ? "New category" : `Edit "${editing.name}"`}</h3>
          <CategoryForm
            key={editing === "new" ? "new" : editing._id}
            initial={editing === "new" ? null : editing}
            categories={flat}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}
    </div>
  );
}