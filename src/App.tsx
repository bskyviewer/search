import { lazy } from "react";
import "./App.css";
import { type SearchParams } from "store/api";
import { useAppSelector, useAppDispatch } from "store/hooks";
import { setSearchParams } from "store/searchSlice";

const SearchResults = lazy(() => import("components/SearchResults.tsx"));
const SearchControls = lazy(() => import("components/SearchControls.tsx"));

function App() {
  const searchParams = useAppSelector((state) => state.search.searchParams);
  const dispatch = useAppDispatch();

  const handleSearchParamsChange = (params: SearchParams | null) => {
    dispatch(setSearchParams(params));
  };

  return (
    <div className="app-container">
      {!searchParams && <h1>Bluesky Search</h1>}
      <SearchControls params={searchParams} onChange={handleSearchParamsChange} />
      {searchParams && <SearchResults query={searchParams} />}
    </div>
  );
}

export default App;
