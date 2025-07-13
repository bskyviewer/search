import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SearchParams } from "./api";

interface SearchState {
  searchParams: SearchParams | null;
}

// Define the form data type that matches the structure in SearchControls.tsx
export interface SearchFormData {
  text: string;
  hashtags: string[];
  languages: { value: string; label: string }[];
  sort: SearchParams["sort"];
  dids: SearchParams["dids"];
  before: SearchParams["before"];
  after: SearchParams["after"];
  excludeLabels: { value: string; label: string }[];
  includeLabels: { value: string; label: string }[];
  embeds: string[];
  isReply: boolean | undefined;
  hasLabel: boolean | undefined;
  hasTag: boolean | undefined;
  hasEmbed: boolean | undefined;
  hasError: boolean | undefined;
}

const initialState: SearchState = {
  searchParams: null,
};

// Helper function to determine the sign for tri-state filters
const sign = (val: boolean) => (val ? "+" : "-");

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    updateSearchFromForm: (state, action: PayloadAction<SearchFormData>) => {
      const data = action.payload;
      let q = "";
      const text = data.text.trim();

      // Add text search with language filters
      if (text && data.languages?.length) {
        q += `+(${data.languages.map((l) => `text_${l.value}:${text}`).join(" ")})`;
      } else {
        // ensure that there's at least one positive clause
        q = "rkey:[* TO *]";
      }

      // Add hashtags
      if (data.hashtags.length) {
        q += ` +tag:(${data.hashtags.join(" ")})`;
      }

      // Add tri-state filters
      if (data.isReply !== undefined) {
        q += ` ${sign(data.isReply)}is:reply`;
      }
      if (data.hasLabel !== undefined) {
        q += ` ${sign(data.hasLabel)}has:label`;
      }
      if (data.hasTag !== undefined) {
        q += ` ${sign(data.hasTag)}has:tag`;
      }
      if (data.hasEmbed !== undefined) {
        q += ` ${sign(data.hasEmbed)}has:embed`;
      }
      if (data.hasError !== undefined) {
        q += ` ${sign(data.hasError)}has:error`;
      }

      // Add label filters
      if (data.excludeLabels.length) {
        q += ` -label:(${data.excludeLabels
          .map((label) => `"${label.value}"`)
          .join(" ")})`;
      }

      if (data.includeLabels.length) {
        q += ` +label:("${data.includeLabels.map((label) => label.value).join('" "')}")`;
      }

      // Add embed filters
      if (data.embeds.length) {
        q += ` embed_type:(${data.embeds.join(" ")})`;
      }

      state.searchParams = {
        q: q.trim(),
        dids: data.dids,
        sort: data.sort,
        limit: 25,
        before: data.before && new Date(data.before).toISOString(),
        after: data.after && new Date(data.after).toISOString(),
        debug: false,
      };
    },
  },
});

export const { updateSearchFromForm } = searchSlice.actions;

export default searchSlice.reducer;
