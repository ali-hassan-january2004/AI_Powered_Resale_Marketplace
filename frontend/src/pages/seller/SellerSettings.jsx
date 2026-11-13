import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateMe } from "../../api/users";
import { setUser } from "../../features/auth/authSlice";
import { errMsg } from "../../utils/errors";
import PageContainer from "../../components/layout/PageContainer";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { toast } from "../../components/ui/toastStore";

const schema = z.object({
  shopName: z.string().trim().min(3, "Shop name must be at least 3 characters").max(40),
  phone: z.string().trim().min(7, "Enter a contact phone number").max(20),
  bio: z.string().trim().max(300).optional(),
  returnPolicy: z.string().trim().max(500).optional(),
});

export default function SellerSettings() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const sp = user.sellerProfile || {};
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { shopName: sp.shopName || "", phone: user.phone || "", bio: sp.bio || "", returnPolicy: sp.returnPolicy || "" },
  });

  const submit = async ({ shopName, phone, bio, returnPolicy }) => {
    try {
      const res = await updateMe({ phone, sellerProfile: { shopName, bio, returnPolicy } });
      dispatch(setUser(res.user || res));
      toast.success("Shop settings saved");
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  return (
    <PageContainer title="Shop settings" className="!px-0 !py-0">
      <form onSubmit={handleSubmit(submit)} noValidate className="max-w-xl space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
        <Input label="Shop name" error={errors.shopName?.message} {...register("shopName")} />
        <Input label="Contact phone" type="tel" error={errors.phone?.message} {...register("phone")} />
        <Textarea label="About your shop" rows={3} maxLength={300} error={errors.bio?.message} {...register("bio")} />
        <Textarea label="Return policy" rows={4} maxLength={500} hint="Shown on your public profile" error={errors.returnPolicy?.message} {...register("returnPolicy")} />
        <Button type="submit" loading={isSubmitting}>Save settings</Button>
      </form>
    </PageContainer>
  );
}