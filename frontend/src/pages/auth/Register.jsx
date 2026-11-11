import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PATHS } from "../../app/routePaths";
import { registerUser } from "../../features/auth/authSlice";
import { errMsg } from "../../utils/errors";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const schema = z
  .object({
    name: z.string().trim().min(2, "Enter your name").max(60),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(8, "Use at least 8 characters").max(72),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords do not match" });

export default function Register() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const submit = async ({ name, email, password }) => {
    setServerError("");
    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
    } catch (e) {
      setServerError(errMsg(e, "Could not create your account"));
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-stone-600">Join to buy and sell pre-loved fashion.</p>
      </div>
      {serverError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}
      <Input label="Full name" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <Input label="Password" type="password" autoComplete="new-password" hint="At least 8 characters" error={errors.password?.message} {...register("password")} />
      <Input label="Confirm password" type="password" autoComplete="new-password" error={errors.confirm?.message} {...register("confirm")} />
      <Button type="submit" className="w-full" loading={isSubmitting}>Create account</Button>
      <p className="text-center text-sm text-stone-600">
        Already registered? <Link to={PATHS.login} state={location.state} className="font-medium text-emerald-700 hover:underline">Log in</Link>
      </p>
    </form>
  );
}