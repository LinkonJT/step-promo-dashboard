import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-sm text-gray-500 mt-2">
          Step Promo Dashboard — authorised users only
        </p>
      </div>

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/tote-bag" });
        }}
      >
        <button
          type="submit"
          className="px-6 py-2.5 rounded-md bg-black text-white text-sm hover:bg-gray-800 transition-colors"
        >
          Sign in with Google
        </button>
      </form>
    </main>
  );
}