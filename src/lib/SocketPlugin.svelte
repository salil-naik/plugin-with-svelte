<script>
  import { onMount } from "svelte";
  import ReactAdapter from "./ReactAdapter.svelte";
  import { Bridge } from "@socket.tech/plugin";
  import { provider } from "../store/wallet";
  console.log('provider in plugin', provider);

  // To render the bridge component after localStorage is available
  let isClient = false;

  onMount(() => {
    isClient = true;
  });
</script>

{#if isClient}
  <ReactAdapter
    element={Bridge}
    API_KEY="645b2c8c-5825-4930-baf3-d9b997fcd88c"
    provider={provider}
  />
{/if}
