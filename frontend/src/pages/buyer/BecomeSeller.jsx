import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PATHS } from "../../app/routePaths";
import { becomeSeller, getMe } from "../../api/users";
import { setUser } from "../../features/auth/authSlice";
import { errMsg } from "../../utils/errors";
import PageContainer from "../../components/layout/PageContainer";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { toast } from "../../components/ui/Toast";

const schema = z.object({
  shopName: z.string().trim().min(3, "Shop name must be at least 3 characters").max(40),
  phone: z.string().trim().min(7, "Enter a contact phone number").max(20),
  bio: z.string().trim().max(300).optional(),
});

export default function BecomeSeller() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { shopName: "", phone: user?.phone || "", bio: "" },
  });

  if (user?.role === "seller" || user?.role === "admin") return <Navigate to={PATHS.sellerDashboard} replace />;

  const submit = async (values) => {
    setServerError("");
    try {
      await becomeSeller(values);
      dispatch(setUser(await getMe())); // refresh the profile so the role becomes "seller"
      toast.success("Your shop is ready. Let's list your first item!");
      navigate(PATHS.sellNew, { replace: true });
    } catch (e) {
      setServerError(errMsg(e));
    }
  };

  return (
    <PageContainer narrow title="Open your shop" subtitle="Every seller is also a buyer, so you keep your account and orders.">
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
        {serverError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}
        <Input label="Shop name" error={errors.shopName?.message} {...register("shopName")} />
        <Input label="Contact phone" type="tel" hint="Shown to buyers for order questions" error={errors.phone?.message} {...register("phone")} />
        <Textarea label="About your shop (optional)" rows={3} maxLength={300} error={errors.bio?.message} {...register("bio")} />
        <Button type="submit" loading={isSubmitting}>Become a seller</Button>
      </form>
    </PageContainer>
  );
}