import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import SearchControls from "../SearchControls";
import searchReducer, { updateSearchFromForm } from "../../store/searchSlice";
import { apiSlice } from "../../store/api";

// Mock the API hooks
vi.mock("../../store/api.ts", () => ({
  useLangsQuery: () => ({
    data: { seen: ["en", "es", "fr"] },
    isError: false,
  }),
  useSearchQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
    isSuccess: false,
    error: null,
    refetch: vi.fn(),
  })),
  apiSlice: {
    reducer: () => ({}),
    middleware: () => () => () => {},
  },
}));

// Mock navigator.languages
Object.defineProperty(navigator, "languages", {
  value: ["en-US", "en"],
  configurable: true,
});

// Setup test store
const setupStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      search: searchReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    preloadedState,
  });
};

describe("SearchControls", () => {
  let store;

  beforeEach(() => {
    store = setupStore({
      search: {
        searchParams: null,
      },
    });

    // Spy on store dispatch
    vi.spyOn(store, "dispatch");
  });

  it("renders the search form", () => {
    render(
      <Provider store={store}>
        <SearchControls />
      </Provider>
    );

    // Check that the title is rendered when no search params
    expect(screen.getByText("Bluesky Search")).toBeInTheDocument();

    // Check that the search input is rendered
    expect(screen.getByPlaceholderText("Enter search terms...")).toBeInTheDocument();

    // Check that the search button is rendered
    expect(screen.getByText("Search")).toBeInTheDocument();

    // Check that the advanced button is rendered
    expect(screen.getByText("Advanced...")).toBeInTheDocument();
  });

  it("toggles advanced options when advanced button is clicked", async () => {
    render(
      <Provider store={store}>
        <SearchControls />
      </Provider>
    );

    // Advanced options should be hidden initially
    expect(screen.queryByText("Filters")).not.toBeInTheDocument();

    // Click the advanced button
    fireEvent.click(screen.getByText("Advanced..."));

    // Advanced options should be visible
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Labels")).toBeInTheDocument();
    expect(screen.getByText("Embeds")).toBeInTheDocument();
    expect(screen.getByText("User Filters")).toBeInTheDocument();
    expect(screen.getByText("Date Range")).toBeInTheDocument();

    // Click the hide button
    fireEvent.click(screen.getByText("Hide"));

    // Advanced options should be hidden again
    await waitFor(() => {
      expect(screen.queryByText("Filters")).not.toBeInTheDocument();
    });
  });

  it("dispatches updateSearchFromForm action when form is submitted", async () => {
    render(
      <Provider store={store}>
        <SearchControls />
      </Provider>
    );

    // Enter text in the search input
    const searchInput = screen.getByPlaceholderText("Enter search terms...");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "test query" } });
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByText("Search"));
    });

    // Check that the updateSearchFromForm action was dispatched
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining("updateSearchFromForm"),
          payload: expect.objectContaining({
            text: "test query",
          }),
        })
      );
    });
  });

  it("handles tri-state toggle interactions", async () => {
    render(
      <Provider store={store}>
        <SearchControls />
      </Provider>
    );

    // Open advanced options
    await act(async () => {
      fireEvent.click(screen.getByText("Advanced..."));
    });

    // Find the Is Reply tri-state toggle
    const isReplyLabel = screen.getByText("Is Reply");
    const isReplyToggle = isReplyLabel.parentElement;

    // Find the Yes button within the toggle
    const yesButton = isReplyToggle.querySelector("button:nth-child(1)");

    // Click the Yes button
    await act(async () => {
      fireEvent.click(yesButton);
    });

    // The Yes button should now be selected
    expect(yesButton).toHaveClass("selected");

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByText("Search"));
    });

    // Check that the updateSearchFromForm action was dispatched with isReply: true
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            isReply: true,
          }),
        })
      );
    });
  });

  it("handles language selection", async () => {
    render(
      <Provider store={store}>
        <SearchControls />
      </Provider>
    );

    // Open advanced options
    fireEvent.click(screen.getByText("Advanced..."));

    // Find the Languages select
    const languagesLabel = screen.getByText("Languages");

    // The select should be in the document
    expect(languagesLabel).toBeInTheDocument();

    // Note: Testing react-select interactions is complex and may require more specific tests
    // This is a basic test to ensure the component renders
  });

  it("handles date range inputs", async () => {
    render(
      <Provider store={store}>
        <SearchControls />
      </Provider>
    );

    // Open advanced options
    await act(async () => {
      fireEvent.click(screen.getByText("Advanced..."));
    });

    // Find the date inputs
    const afterDateInput = screen.getByLabelText("After Date");
    const beforeDateInput = screen.getByLabelText("Before Date");

    // Enter dates
    await act(async () => {
      fireEvent.change(afterDateInput, { target: { value: "2023-01-01T00:00" } });
      fireEvent.change(beforeDateInput, { target: { value: "2023-12-31T23:59" } });
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByText("Search"));
    });

    // Check that the updateSearchFromForm action was dispatched with the correct dates
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            after: "2023-01-01T00:00",
            before: "2023-12-31T23:59",
          }),
        })
      );
    });
  });
});
