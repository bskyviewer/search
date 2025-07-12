import { type FormEvent, useState } from "react";
import "./App.css";
import { type SearchParams } from "./store/api";
import { SearchResults } from "components/SearchResults.tsx";

function App() {
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({
        q: query,
        sort: ["relevance"],
        limit: 20,
        debug: false,
        dids: [],
      });
    }
  };

  return (
    <div className="app-container">
      <h1>Bluesky Search</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search terms..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {searchParams && <SearchResults query={searchParams} />}
    </div>
  );
}

export default App;
