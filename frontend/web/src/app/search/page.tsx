import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-6">Searching listings...</p>}>
      <SearchResultsClient />
    </Suspense>
  );
}