import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PATHS } from "../../app/routePaths";
import { loginUser } from "../../features/auth/authSlice";
import { errMsg } from "../../utils/errors";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export default function Login() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  // On success AuthLayout sees the user and redirects to the page they came from.
  const submit = async (values) => {
    setServerError("");
    try {
      await dispatch(loginUser(values)).unwrap();
    } catch (e) {
      setServerError(errMsg(e, "Could not log in"));
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-stone-600">Log in to buy, sell and track your orders.</p>
      </div>
      {location.state?.from && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Please log in to continue.</p>}
      {serverError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register("password")} />
      <div className="text-right">
        <Link to={PATHS.forgotPassword} className="text-sm text-emerald-700 hover:underline">Forgot password?</Link>
      </div>
      <Button type="submit" className="w-full" loading={isSubmitting}>Log in</Button>
      <p className="text-center text-sm text-stone-600">
        New here? <Link to={PATHS.register} state={location.state} className="font-medium text-emerald-700 hover:underline">Create an account</Link>
      </p>
    </form>
  );
}