declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPORT_DOCS?: string;
    readonly NEXT_PUBLIC_CAPSULE_ENV?: "DEV" | "SANDBOX" | "BETA" | "PROD";
  }
}
