import { describe, it, expect } from "vitest";
import reducer, {
  updateSearchFromForm,
  type SearchFormData,
} from "../searchSlice";

describe("search slice", () => {
  // Test initial state
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "" })).toEqual({
      searchParams: null,
    });
  });

  // Test updateSearchFromForm reducer with basic text search
  it("should handle updateSearchFromForm with basic text search", () => {
    const formData: SearchFormData = {
      text: "test query",
      hashtags: [],
      languages: [],
      sort: "desc",
      dids: [],
      before: undefined,
      after: undefined,
      excludeLabels: [],
      includeLabels: [],
      embeds: [],
      isReply: undefined,
      hasLabel: undefined,
      hasTag: undefined,
      hasEmbed: undefined,
      hasError: undefined,
    };

    const expectedState = {
      searchParams: {
        q: "rkey:[* TO *]",
        dids: [],
        sort: ["desc"],
        limit: 25,
        before: undefined,
        after: undefined,
        debug: false,
      },
    };

    expect(reducer(undefined, updateSearchFromForm(formData))).toEqual(
      expectedState,
    );
  });

  // Test with language filters
  it("should handle updateSearchFromForm with text and language filters", () => {
    const formData: SearchFormData = {
      text: "test query",
      hashtags: [],
      languages: [{ value: "en", label: "English" }],
      sort: "desc",
      dids: [],
      before: undefined,
      after: undefined,
      excludeLabels: [],
      includeLabels: [],
      embeds: [],
      isReply: undefined,
      hasLabel: undefined,
      hasTag: undefined,
      hasEmbed: undefined,
      hasError: undefined,
    };

    const expectedState = {
      searchParams: {
        q: "+(text_en:test query)",
        dids: [],
        sort: ["desc"],
        limit: 25,
        before: undefined,
        after: undefined,
        debug: false,
      },
    };

    expect(reducer(undefined, updateSearchFromForm(formData))).toEqual(
      expectedState,
    );
  });

  // Test with hashtags
  it("should handle updateSearchFromForm with hashtags", () => {
    const formData: SearchFormData = {
      text: "",
      hashtags: ["coding", "javascript"],
      languages: [],
      sort: "desc",
      dids: [],
      before: undefined,
      after: undefined,
      excludeLabels: [],
      includeLabels: [],
      embeds: [],
      isReply: undefined,
      hasLabel: undefined,
      hasTag: undefined,
      hasEmbed: undefined,
      hasError: undefined,
    };

    const expectedState = {
      searchParams: {
        q: "rkey:[* TO *] +tag:(coding javascript)",
        dids: [],
        sort: ["desc"],
        limit: 25,
        before: undefined,
        after: undefined,
        debug: false,
      },
    };

    expect(reducer(undefined, updateSearchFromForm(formData))).toEqual(
      expectedState,
    );
  });

  // Test with tri-state filters
  it("should handle updateSearchFromForm with tri-state filters", () => {
    const formData: SearchFormData = {
      text: "",
      hashtags: [],
      languages: [],
      sort: "desc",
      dids: [],
      before: undefined,
      after: undefined,
      excludeLabels: [],
      includeLabels: [],
      embeds: [],
      isReply: true,
      hasLabel: false,
      hasTag: true,
      hasEmbed: false,
      hasError: true,
    };

    const expectedState = {
      searchParams: {
        q: "rkey:[* TO *] +is:reply -has:label +has:tag -has:embed +has:error",
        dids: [],
        sort: ["desc"],
        limit: 25,
        before: undefined,
        after: undefined,
        debug: false,
      },
    };

    expect(reducer(undefined, updateSearchFromForm(formData))).toEqual(
      expectedState,
    );
  });

  // Test with label filters
  it("should handle updateSearchFromForm with label filters", () => {
    const formData: SearchFormData = {
      text: "",
      hashtags: [],
      languages: [],
      sort: "desc",
      dids: [],
      before: undefined,
      after: undefined,
      excludeLabels: [{ value: "spam", label: "Spam" }],
      includeLabels: [{ value: "important", label: "Important" }],
      embeds: [],
      isReply: undefined,
      hasLabel: undefined,
      hasTag: undefined,
      hasEmbed: undefined,
      hasError: undefined,
    };

    const expectedState = {
      searchParams: {
        q: 'rkey:[* TO *] -label:("spam") +label:("important")',
        dids: [],
        sort: ["desc"],
        limit: 25,
        before: undefined,
        after: undefined,
        debug: false,
      },
    };

    expect(reducer(undefined, updateSearchFromForm(formData))).toEqual(
      expectedState,
    );
  });

  // Test with embed filters
  it("should handle updateSearchFromForm with embed filters", () => {
    const formData: SearchFormData = {
      text: "",
      hashtags: [],
      languages: [],
      sort: "desc",
      dids: [],
      before: undefined,
      after: undefined,
      excludeLabels: [],
      includeLabels: [],
      embeds: ["image", "video"],
      isReply: undefined,
      hasLabel: undefined,
      hasTag: undefined,
      hasEmbed: undefined,
      hasError: undefined,
    };

    const expectedState = {
      searchParams: {
        q: "rkey:[* TO *] +embed_type:(image video)",
        dids: [],
        sort: ["desc"],
        limit: 25,
        before: undefined,
        after: undefined,
        debug: false,
      },
    };

    expect(reducer(undefined, updateSearchFromForm(formData))).toEqual(
      expectedState,
    );
  });

  // Test with date filters
  it("should handle updateSearchFromForm with date filters", () => {
    const beforeDate = "2023-01-01";
    const afterDate = "2022-01-01";

    const formData: SearchFormData = {
      text: "",
      hashtags: [],
      languages: [],
      sort: "desc",
      dids: [],
      before: beforeDate,
      after: afterDate,
      excludeLabels: [],
      includeLabels: [],
      embeds: [],
      isReply: undefined,
      hasLabel: undefined,
      hasTag: undefined,
      hasEmbed: undefined,
      hasError: undefined,
    };

    const expectedState = {
      searchParams: {
        q: "rkey:[* TO *]",
        dids: [],
        sort: ["desc"],
        limit: 25,
        before: new Date(beforeDate).toISOString(),
        after: new Date(afterDate).toISOString(),
        debug: false,
      },
    };

    expect(reducer(undefined, updateSearchFromForm(formData))).toEqual(
      expectedState,
    );
  });

  // Test with complex search combining multiple filters
  it("should handle updateSearchFromForm with complex search combining multiple filters", () => {
    const formData: SearchFormData = {
      text: "test query",
      hashtags: ["coding"],
      languages: [{ value: "en", label: "English" }],
      sort: "desc",
      dids: ["did:example:123"],
      before: undefined,
      after: undefined,
      excludeLabels: [{ value: "spam", label: "Spam" }],
      includeLabels: [{ value: "important", label: "Important" }],
      embeds: ["image"],
      isReply: false,
      hasLabel: true,
      hasTag: undefined,
      hasEmbed: undefined,
      hasError: undefined,
    };

    const expectedState = {
      searchParams: {
        q: '+(text_en:test query) +tag:(coding) -is:reply +has:label -label:("spam") +label:("important") +embed_type:(image)',
        dids: ["did:example:123"],
        sort: ["desc"],
        limit: 25,
        before: undefined,
        after: undefined,
        debug: false,
      },
    };

    expect(reducer(undefined, updateSearchFromForm(formData))).toEqual(
      expectedState,
    );
  });
});
