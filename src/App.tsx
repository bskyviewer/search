import { useState } from "react";
import "./App.css";
import { type SearchParams, useSearchQuery } from "./store/api";
import { SearchResults } from "components/SearchResults.tsx";
import { SearchControls } from "components/SearchControls.tsx";
import { skipToken } from "@reduxjs/toolkit/query";

function App() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const searchResult = useSearchQuery(searchParams || skipToken);

  const onChange = (p: SearchParams) => {
    setSearchParams(p);
    if (
      searchParams &&
      searchResult.isSuccess &&
      (searchParams === p ||
        Object.entries(searchParams).every(([k, v]) => {
          const v2 = p[k as keyof SearchParams];
          return (
            v === v2 ||
            (Array.isArray(v) &&
              Array.isArray(v2) &&
              v.length === v2?.length &&
              v.every((i, n) => i === v2[n]))
          );
        }))
    ) {
      searchResult.refetch();
    }
  };

  return (
    <div className="app-container">
      <h1>Bluesky Search</h1>
      <SearchControls onChange={onChange} />
      {searchParams && (
        <SearchResults search={searchResult} query={searchParams.q} />
      )}
    </div>
  );
}

export default App;
