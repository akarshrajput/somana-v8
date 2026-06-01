import UpdateBlog from "@/app/_components/articleComponents/UpdateBlog";
import { auth } from "@/app/_lib/auth";

export const metadata = {
  title: "Edit Story — Somana",
  description: "Edit your story on Somana.",
  robots: { index: false, follow: false },
};


const Page = async ({ params }) => {
  const { storyId } = await params;
  const session = await auth();
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hostname = process.env.HOSTNAME;
  return (
    <div className="my-2 mt-6 flex justify-center">
      <div className="w-[1200px]">
        <UpdateBlog
          storyId={storyId}
          session={session}
          supabaseURL={supabaseURL}
          hostname={hostname}
        />
      </div>
    </div>
  );
};
export default Page;
