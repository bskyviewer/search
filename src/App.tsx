import { lazy, useState } from "react";
import "./App.css";
import { type SearchParams } from "store/api";

const SearchResults = lazy(() => import("components/SearchResults.tsx"));
const SearchControls = lazy(() => import("components/SearchControls.tsx"));

function App() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  return (
    <div className="app-container">
      {!searchParams && <h1>Bluesky Search</h1>}
      <SearchControls params={searchParams} onChange={setSearchParams} />
      {searchParams && <SearchResults query={searchParams} />}
    </div>
  );
}

export default App;
