import GoogleSignInButton from "./GoogleSignInButton";

export default function AuthPrompt({
  title = "Continue with Google",
  description = "Please sign in to continue.",
}) {
  return (
    <div className="rounded-[2rem] bg-white p-8 shadow-lg">
      <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Authentication</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 max-w-xl text-sm text-slate-600 sm:text-base">{description}</p>
      <div className="mt-8">
        <GoogleSignInButton />
      </div>
    </div>
  );
}
