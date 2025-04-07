import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <h1>Create Account</h1>
        <p>Sign up to get started with our platform</p>
      </div>

      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
