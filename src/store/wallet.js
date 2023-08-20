import { writable, derived } from 'svelte/store'

export const provider = writable(null);
export const signer = writable(null);
export const selectedAddress = derived([signer], async ([$signer], set) => {
	if (!$signer) return set(null);
	const address = await $signer.getAddress();
	set(address);
}, null);