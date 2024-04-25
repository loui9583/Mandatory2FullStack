import { writable } from "svelte/store";

const defaultApi = "http://localhost:3000";

export const user = writable(null);

export const api = writable(defaultApi);