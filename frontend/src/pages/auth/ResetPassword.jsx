import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PATHS } from "../../app/routePaths";
import { resetPassword } from "../../api/auth";
import { errMsg } from "../../utils/errors";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "../../components/ui/toastStore";

const schema = z
  .object({ password: z.string().min(8, "Use at least 8 characters").max(72), confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords do not match" });

export default function ResetPassword() {
  const [sp] = useSearchParams();
  const token = sp.get("token");
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  if (!token) {
    return (
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold">Invalid reset link</h1>
        <p className="text-sm text-stone-600">This link is missing its token. Please request a new one.</p>
        <Link to={PATHS.forgotPassword} className="text-sm font-medium text-emerald-700 hover:underline">Request a new link</Link>
      </div>
    );
  }

  const submit = async ({ password }) => {
    setServerError("");
    try {
      await resetPassword(token, password);
      toast.success("Password updated. Please log in.");
      navigate(PATHS.login, { replace: true });
    } catch (e) {
      setServerError(errMsg(e, "This link has expired or was already used."));
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <h1 className="text-2xl font-bold">Choose a new password</h1>
      {serverError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}
      <Input label="New password" type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
      <Input label="Confirm password" type="password" autoComplete="new-password" error={errors.confirm?.message} {...register("confirm")} />
      <Button type="submit" className="w-full" loading={isSubmitting}>Update password</Button>
    </form>
  );
}