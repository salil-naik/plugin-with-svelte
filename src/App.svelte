<script>
  import { connectWallet } from "./lib/connect";
  import { selectedAddress } from "./store/wallet";
  import SocketPlugin from "./lib/SocketPlugin.svelte";
</script>

<main>
  <h1>Hello User!</h1>
  {#if $selectedAddress}
    <div>{$selectedAddress}</div>
    <SocketPlugin />
  {:else}
    <button on:click={() => connectWallet()}>Connect Metamask</button>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
