import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Sign in to your account to continue</p>
      </div>

      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
