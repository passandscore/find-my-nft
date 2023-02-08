import dynamic from "next/dynamic";

export const SearchForm = dynamic(
  () => import("./SearchForm").then((module) => module.SearchForm),
  { ssr: false }
);

export const InputFields = dynamic(
  () => import("./InputFields").then((module) => module.InputFields),
  { ssr: false }
);
