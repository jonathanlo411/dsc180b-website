import { BROWSER } from 'esm-env';
import { persisted } from 'svelte-local-storage-store';

export const theme = persisted('svelte:theme', {
	current: BROWSER
		? window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light'
		: 'light'
});

theme.subscribe(($theme) => {
	if (!BROWSER) return;

	document.body.classList.remove('light', 'dark');
	document.body.classList.add($theme.current);
});