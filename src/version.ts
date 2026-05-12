// Bump APP_VERSION whenever a release is pushed.
// SaveState stores this string at save time so we can debug "which app version
// produced this save?" later.
//
// MUST be a simple string literal so the bundler can statically inline it.
export const APP_VERSION = "0.4.0-separated-art";
