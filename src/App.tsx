import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useSearch } from "src/api.ts";

function App() {
  const [query, setQuery] = useState("search terms");
  const searchResults = useSearch({ q: query });

  return <></>;
}

export default App;
