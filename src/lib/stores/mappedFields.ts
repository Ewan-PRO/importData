import { writable } from 'svelte/store';

export const mappedFields = writable<Record<string, string>>({});