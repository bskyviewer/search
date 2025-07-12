import { useState } from "react";
import "./App.css";
import { type SearchParams } from "./store/api";
import { SearchResults } from "components/SearchResults.tsx";
import { SearchControls } from "components/SearchControls.tsx";

function App() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  return (
    <div className="app-container">
      <h1>Bluesky Search</h1>
      <SearchControls onChange={setSearchParams} />
      {searchParams && <SearchResults query={searchParams} />}
    </div>
  );
}

export default App;
