import { lazy } from "react";
import "./App.css";

const SearchResults = lazy(() => import("components/SearchResults.tsx"));
const SearchControls = lazy(() => import("components/SearchControls.tsx"));

function App() {
  return (
    <div className="app-container">
      <SearchControls />
      <SearchResults />
    </div>
  );
}

export default App;
