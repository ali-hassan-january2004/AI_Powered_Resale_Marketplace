import { useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../app/routePaths";
import { forgotPassword } from "../../api/auth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email address");
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email.trim());
    } catch {
      /* Same message either way, so the form never reveals which emails exist. */
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-sm text-stone-600">
          If an account exists for <span className="font-medium">{email}</span>, we've sent a reset link. It expires in 30 minutes.
        </p>
        <Link to={PATHS.login} className="inline-block text-sm font-medium text-emerald-700 hover:underline">Back to login</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-sm text-stone-600">Enter your email and we'll send you a reset link.</p>
      </div>
      <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
      <Button type="submit" className="w-full" loading={loading}>Send reset link</Button>
      <p className="text-center text-sm"><Link to={PATHS.login} className="text-emerald-700 hover:underline">Back to login</Link></p>
    </form>
  );
}