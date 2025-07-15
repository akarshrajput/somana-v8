export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Search from "../_components/main/Search";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Search />
    </Suspense>
  );
}
