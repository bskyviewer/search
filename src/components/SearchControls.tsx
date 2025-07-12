import * as React from "react";
import { type Dispatch, type SetStateAction, useMemo } from "react";
import { type SearchParams, useLangsQuery } from "store/api.ts";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
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
    includeLabels: [] as (typeof labelOptions)[],
    enbeds: [] as Required<AppBskyFeedDefs.PostView>["embed"]["$type"][],
    // tri-state option
    isReply: undefined as boolean | undefined,
    hasLabel: undefined as boolean | undefined,
    hasTag: undefined as boolean | undefined,
    hasEmbed: undefined as boolean | undefined,
    hasError: undefined as boolean | undefined,
  };

  type FormData = typeof defaultValues;

  const { register, control, handleSubmit } = useForm<FormData>({
    defaultValues,
  });

  const handler = (data: FormData) => {
    let q = "";
    const text = data.text.trim();
    if (text && data.languages?.length) {
      q += `+(${data.languages.map((l) => `text_${l.value}:${text}`).join(" ")})`;
    }
    onChange({
      q,
      dids: data.dids,
      sort: data.sort,
      limit: 25,
      debug: false,
    });
  };

  return (
    <form onSubmit={handleSubmit(handler)} className="search-form">
      <input
        type="text"
        placeholder="Enter search terms..."
        className="search-input"
        {...register("text")}
      />
      <Controller
        name="languages"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            onChange={(selectedOption) => field.onChange(selectedOption)}
            options={langOptions}
            isMulti
          />
        )}
      />
      <button type="submit" className="search-button">
        Search
      </button>
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
