<script>
  import { onMount, onDestroy } from "svelte";
  import ReactAdapter from "./ReactAdapter.svelte";
  import { Bridge } from "@socket.tech/plugin";
  import { provider } from "../store/wallet";

  // To render the bridge component after localStorage is available
  let isClient = false;
  let providerValue = null;

  onMount(() => {
    isClient = true;
  });

  // Subscribe to the provider store to get its current value
  const unsubscribe = provider.subscribe((value) => {
    providerValue = value;
  });

  // Unsubscribe when the component is destroyed
  onDestroy(unsubscribe);
</script>

{#if isClient}
  <ReactAdapter
    element={Bridge}
    API_KEY="645b2c8c-5825-4930-baf3-d9b997fcd88c"
    provider={providerValue}
  />
{/if}
