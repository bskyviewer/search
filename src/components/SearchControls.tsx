import * as React from "react";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { type SearchParams, useLangsQuery } from "store/api.ts";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { LABELS } from "@atproto/api/src/moderation/const/labels.ts";
import type * as AppBskyFeedDefs from "@atproto/api/src/client/types/app/bsky/feed/defs.ts";

type Props = {
  onChange: Dispatch<SetStateAction<SearchParams | null>>;
};

// Default set of options; custom values can be created.
const labelOptions = Object.keys(LABELS).map((value) => ({
  value,
  label: value,
}));

// Sort options
const sortOptions = [
  { value: "desc", label: "Newest first" },
  { value: "asc", label: "Oldest first" },
  { value: "relevance", label: "Most relevant" },
];

// Embed type options
const embedOptions = [
  { value: "app.bsky.embed.images", label: "Images" },
  { value: "app.bsky.embed.video", label: "Video" },
  { value: "app.bsky.embed.external", label: "External link" },
  { value: "app.bsky.embed.record", label: "Record" },
  { value: "app.bsky.embed.recordWithMedia", label: "Record with media" },
];

// Tri-state toggle component
const TriStateToggle: React.FC<{
  label: string;
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
}> = ({ label, value, onChange }) => {
  const handleToggle = (newValue: boolean | undefined) => {
    onChange(newValue);
  };

  return (
    <div className="form-field-inline">
      <label>{label}</label>
      <div className="tri-state-toggle">
        <button
          type="button"
          className={`tri-state-option ${value === true ? "selected" : ""}`}
          onClick={() => handleToggle(true)}
        >
          Yes
        </button>
        <button
          type="button"
          className={`tri-state-option ${value === false ? "selected" : ""}`}
          onClick={() => handleToggle(false)}
        >
          No
        </button>
        <button
          type="button"
          className={`tri-state-option ${value === undefined ? "selected" : ""}`}
          onClick={() => handleToggle(undefined)}
        >
          Any
        </button>
      </div>
    </div>
  );
};

const Form: React.FC<
  Props & {
    langs: ReturnType<typeof langData>;
  }
> = ({ onChange, langs: [defaultLangs, langOptions] }) => {
  const defaultValues = {
    text: "",
    hashtags: [] as string[],
    languages: defaultLangs,
    sort: ["desc"] as SearchParams["sort"],
    dids: [] as SearchParams["dids"],
    before: undefined as SearchParams["before"],
    after: undefined as SearchParams["after"],
    debug: false,
    excludeLabels: labelOptions,
    includeLabels: [] as typeof labelOptions,
    embeds: [] as Required<AppBskyFeedDefs.PostView>["embed"]["$type"][],
    // tri-state option
    isReply: undefined as boolean | undefined,
    hasLabel: undefined as boolean | undefined,
    hasTag: undefined as boolean | undefined,
    hasEmbed: undefined as boolean | undefined,
    hasError: undefined as boolean | undefined,
  };

  type FormData = typeof defaultValues;

  const { register, control, handleSubmit, watch, setValue } =
    useForm<FormData>({
      defaultValues,
    });

  // Watch values for tri-state toggles
  const isReply = watch("isReply");
  const hasLabel = watch("hasLabel");
  const hasTag = watch("hasTag");
  const hasEmbed = watch("hasEmbed");
  const hasError = watch("hasError");

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handler = (data: FormData) => {
    let q = "";
    const text = data.text.trim();

    // Add text search with language filters
    if (text && data.languages?.length) {
      q += `+(${data.languages.map((l) => `text_${l.value}:${text}`).join(" ")})`;
    }

    // Add hashtags
    if (data.hashtags.length) {
      const hashtagsQuery = data.hashtags
        .map((tag) => `hashtag:${tag}`)
        .join(" ");
      q += q ? ` ${hashtagsQuery}` : hashtagsQuery;
    }

    // Add tri-state filters
    if (data.isReply !== undefined) {
      q += ` isReply:${data.isReply}`;
    }
    if (data.hasLabel !== undefined) {
      q += ` hasLabel:${data.hasLabel}`;
    }
    if (data.hasTag !== undefined) {
      q += ` hasTag:${data.hasTag}`;
    }
    if (data.hasEmbed !== undefined) {
      q += ` hasEmbed:${data.hasEmbed}`;
    }
    if (data.hasError !== undefined) {
      q += ` hasError:${data.hasError}`;
    }

    // Add label filters
    if (data.excludeLabels.length) {
      const excludeLabelsQuery = data.excludeLabels
        .map((label) => `-label:${label.value}`)
        .join(" ");
      q += q ? ` ${excludeLabelsQuery}` : excludeLabelsQuery;
    }

    if (data.includeLabels.length) {
      const includeLabelsQuery = data.includeLabels
        .map((label) => `label:${label.value}`)
        .join(" ");
      q += q ? ` ${includeLabelsQuery}` : includeLabelsQuery;
    }

    // Add embed filters
    if (data.embeds.length) {
      const embedsQuery = data.embeds
        .map((embed) => `embed:${embed}`)
        .join(" ");
      q += q ? ` ${embedsQuery}` : embedsQuery;
    }

    onChange({
      q: q.trim(),
      dids: data.dids,
      sort: data.sort,
      limit: 25,
      debug: data.debug,
      before: data.before,
      after: data.after,
    });
  };

  return (
    <form onSubmit={handleSubmit(handler)} className="search-form">
      {/* Basic Search Section */}
      <div className="search-form-group">
        <h3>Basic Search</h3>

        <div className="search-form-row">
          <input
            type="text"
            placeholder="Enter search terms..."
            className="search-input"
            {...register("text")}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </div>

        <div className="form-field">
          <label htmlFor="languages">Languages</label>
          <Controller
            name="languages"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="languages"
                onChange={(selectedOption) => field.onChange(selectedOption)}
                options={langOptions}
                isMulti
                placeholder="Select languages..."
              />
            )}
          />
        </div>

        <div className="form-field">
          <label htmlFor="hashtags">Hashtags</label>
          <Controller
            name="hashtags"
            control={control}
            render={({ field }) => (
              <CreatableSelect
                {...field}
                id="hashtags"
                isMulti
                onChange={(selected) => {
                  const values = selected
                    ? selected.map((item) => item.value)
                    : [];
                  field.onChange(values);
                }}
                value={field.value.map((value: string) => ({
                  value,
                  label: `#${value}`,
                }))}
                placeholder="Add hashtags..."
              />
            )}
          />
        </div>

        <div className="form-field">
          <label htmlFor="sort">Sort By</label>
          <Controller
            name="sort"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="sort"
                options={sortOptions}
                isMulti
                onChange={(selected) => {
                  const values = selected
                    ? selected.map((item) => item.value)
                    : [];
                  field.onChange(values);
                }}
                value={sortOptions.filter((option) =>
                  field.value.includes(
                    option.value as "desc" | "asc" | "relevance",
                  ),
                )}
              />
            )}
          />
        </div>
      </div>

      {/* Toggle for Advanced Options */}
      <button
        type="button"
        className="search-button"
        style={{ alignSelf: "flex-start" }}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
      </button>

      {showAdvanced && (
        <>
          {/* Filters Section */}
          <div className="search-form-group">
            <h3>Filters</h3>

            <div className="form-field">
              <TriStateToggle
                label="Is Reply"
                value={isReply}
                onChange={(value) => setValue("isReply", value)}
              />
            </div>

            <div className="form-field">
              <TriStateToggle
                label="Has Label"
                value={hasLabel}
                onChange={(value) => setValue("hasLabel", value)}
              />
            </div>

            <div className="form-field">
              <TriStateToggle
                label="Has Tag"
                value={hasTag}
                onChange={(value) => setValue("hasTag", value)}
              />
            </div>

            <div className="form-field">
              <TriStateToggle
                label="Has Embed"
                value={hasEmbed}
                onChange={(value) => setValue("hasEmbed", value)}
              />
            </div>

            <div className="form-field">
              <TriStateToggle
                label="Has Error"
                value={hasError}
                onChange={(value) => setValue("hasError", value)}
              />
            </div>
          </div>

          {/* Labels Section */}
          <div className="search-form-group">
            <h3>Labels</h3>

            <div className="form-field">
              <label htmlFor="excludeLabels">Exclude Labels</label>
              <Controller
                name="excludeLabels"
                control={control}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    id="excludeLabels"
                    options={labelOptions}
                    isMulti
                    placeholder="Select labels to exclude..."
                  />
                )}
              />
            </div>

            <div className="form-field">
              <label htmlFor="includeLabels">Include Labels</label>
              <Controller
                name="includeLabels"
                control={control}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    id="includeLabels"
                    options={labelOptions}
                    isMulti
                    placeholder="Select labels to include..."
                  />
                )}
              />
            </div>
          </div>

          {/* Embeds Section */}
          <div className="search-form-group">
            <h3>Embeds</h3>

            <div className="form-field">
              <label htmlFor="embeds">Embed Types</label>
              <Controller
                name="embeds"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="embeds"
                    options={embedOptions}
                    isMulti
                    onChange={(selected) => {
                      const values = selected
                        ? selected.map((item) => item.value)
                        : [];
                      field.onChange(values);
                    }}
                    value={embedOptions.filter((option) =>
                      field.value.includes(option.value),
                    )}
                    placeholder="Select embed types..."
                  />
                )}
              />
            </div>
          </div>

          {/* User Filters Section */}
          <div className="search-form-group">
            <h3>User Filters</h3>

            <div className="form-field">
              <label htmlFor="dids">User DIDs</label>
              <Controller
                name="dids"
                control={control}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    id="dids"
                    isMulti
                    onChange={(selected) => {
                      const values = selected
                        ? selected.map((item) => item.value)
                        : [];
                      field.onChange(values);
                    }}
                    value={field.value.map((value: string) => ({
                      value,
                      label: value,
                    }))}
                    placeholder="Enter user DIDs..."
                  />
                )}
              />
            </div>
          </div>

          {/* Date Range Section */}
          <div className="search-form-group">
            <h3>Date Range</h3>

            <div className="form-field">
              <label htmlFor="after">After Date</label>
              <input
                id="after"
                type="datetime-local"
                className="search-input"
                {...register("after")}
              />
            </div>

            <div className="form-field">
              <label htmlFor="before">Before Date</label>
              <input
                id="before"
                type="datetime-local"
                className="search-input"
                {...register("before")}
              />
            </div>
          </div>

          {/* Debug Section */}
          <div className="search-form-group">
            <h3>Debug</h3>

            <div className="form-field-inline">
              <input id="debug" type="checkbox" {...register("debug")} />
              <label htmlFor="debug">Enable Debug Mode</label>
            </div>
          </div>
        </>
      )}
    </form>
  );
};

export const SearchControls: React.FC<Props> = ({ onChange }) => {
  const { data, isError } = useLangsQuery();
  const langs = useMemo(() => langData(data?.seen), [data?.seen]);

  // Wait until data is loaded before rendering form, so that defaults are initialized as expected
  if (!langs[1].length && !isError) {
    return null;
  }

  return <Form onChange={onChange} langs={langs} />;
};

function langData(seen: string[] = []) {
  const defaultLangs = navigator.languages.filter((l) => seen.includes(l));
  seen = [
    ...defaultLangs,
    ...seen.filter((l) => !defaultLangs.includes(l)).sort(),
  ];
  const names = new Intl.DisplayNames(seen, { type: "language" });
  const options = seen.map((value) => {
    let label = value;
    try {
      label = names.of(value) || value;
    } catch (e) {
      console.debug("Invalid language code", value, e);
    }
    return { value, label };
  });
  return [
    defaultLangs.map((l) => options.find((o) => o.value === l)!),
    options,
  ] as const;
}
