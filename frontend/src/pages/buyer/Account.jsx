import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PATHS } from "../../app/routePaths";
import { updateMe } from "../../api/users";
import { setUser } from "../../features/auth/authSlice";
import { errMsg } from "../../utils/errors";
import PageContainer from "../../components/layout/PageContainer";
import AddressForm from "../../components/commerce/AddressForm";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Tabs from "../../components/ui/Tabs";
import { toast } from "../../components/ui/toastStore";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(60),
  phone: z.string().trim().max(20).optional(),
  bio: z.string().trim().max(300).optional(),
  avatarUrl: z.string().trim().url("Enter a valid image URL").or(z.literal("")).optional(),
});

function ProfileTab({ user, save }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name || "", phone: user.phone || "", bio: user.bio || "", avatarUrl: user.avatarUrl || "" },
  });

  const submit = async (values) => {
    try {
      await save(values);
      toast.success("Profile updated");
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="max-w-lg space-y-4">
      <Input label="Name" error={errors.name?.message} {...register("name")} />
      <Input label="Email" value={user.email} disabled readOnly hint="Email cannot be changed" />
      <Input label="Phone" type="tel" error={errors.phone?.message} {...register("phone")} />
      <Input label="Photo URL" placeholder="https://…" error={errors.avatarUrl?.message} {...register("avatarUrl")} />
      <Textarea label="Bio" rows={3} maxLength={300} error={errors.bio?.message} {...register("bio")} />
      <Button type="submit" loading={isSubmitting}>Save changes</Button>
    </form>
  );
}

function AddressesTab({ addresses, save }) {
  const [editing, setEditing] = useState(null); // address | "new" | null
  const [deleting, setDeleting] = useState(null);

  const saveAddress = async (values) => {
    const isNew = editing === "new";
    const idx = isNew ? addresses.length : addresses.findIndex((a) => a._id === editing._id);
    let next = isNew ? [...addresses, values] : addresses.map((a, i) => (i === idx ? { ...a, ...values } : a));
    if (values.isDefault) next = next.map((a, i) => ({ ...a, isDefault: i === idx }));
    else if (!next.some((a) => a.isDefault)) next = next.map((a, i) => ({ ...a, isDefault: i === 0 }));
    try {
      await save({ addresses: next });
      toast.success("Address saved");
      setEditing(null);
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  const removeAddress = async () => {
    const next = addresses.filter((a) => a._id !== deleting._id);
    if (next.length && !next.some((a) => a.isDefault)) next[0] = { ...next[0], isDefault: true };
    await save({ addresses: next });
    toast.success("Address removed");
  };

  return (
    <div className="max-w-2xl">
      <ul className="space-y-3">
        {addresses.map((a) => (
          <li key={a._id} className="flex items-start justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4">
            <div className="text-sm">
              <p className="font-medium">{a.label || "Address"}{a.isDefault && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">Default</span>}</p>
              <p className="text-stone-600">{a.line1}, {a.city}, {a.region} {a.postalCode}, {a.country}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => setEditing(a)}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => setDeleting(a)}>Delete</Button>
            </div>
          </li>
        ))}
        {!addresses.length && <li className="text-sm text-stone-500">You have no saved addresses yet.</li>}
      </ul>
      <Button className="mt-4" onClick={() => setEditing("new")}>Add address</Button>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === "new" ? "Add address" : "Edit address"}>
        {editing && (
          <AddressForm showDefault defaultValues={editing === "new" ? {} : editing}
            onSubmit={saveAddress} onCancel={() => setEditing(null)} />
        )}
      </Modal>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={removeAddress}
        title="Delete this address?" message="This cannot be undone." confirmLabel="Delete" danger />
    </div>
  );
}

export default function Account() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const [tab, setTab] = useState("profile");

  const save = async (patch) => {
    const res = await updateMe(patch);
    dispatch(setUser(res.user || res));
  };

  const isSeller = user.role === "seller" || user.role === "admin";

  return (
    <PageContainer title="My account" subtitle={user.email} narrow>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm">
          {isSeller ? "Manage your listings, orders and earnings." : "Have clothes you no longer wear? Start selling in minutes."}
        </p>
        <Link to={isSeller ? PATHS.sellerDashboard : PATHS.becomeSeller}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
          {isSeller ? "Seller dashboard" : "Become a seller"}
        </Link>
      </div>

      <Tabs value={tab} onChange={setTab} tabs={[{ id: "profile", label: "Profile" }, { id: "addresses", label: "Addresses", count: (user.addresses || []).length }]} />
      <div className="mt-6">
        {tab === "profile" ? <ProfileTab user={user} save={save} /> : <AddressesTab addresses={user.addresses || []} save={save} />}
      </div>
    </PageContainer>
  );
}