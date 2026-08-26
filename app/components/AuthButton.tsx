import { auth, signIn, signOut } from "@/auth";

export async function AuthButton({ onNavigate }: { onNavigate?: () => void }) {
  const session = await auth();

  if (session) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="px-4 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-100 transition-colors w-full"
        >
          Sign out
        </button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/tote-bag" });
      }}
    >
      <button
        type="submit"
        className="px-4 py-1.5 rounded-md bg-black text-white text-sm hover:bg-gray-800 transition-colors w-full"
      >
        Login
      </button>
    </form>
  );
}