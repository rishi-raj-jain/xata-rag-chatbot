<script lang="ts">
  import Code from './Code.svelte'
  import SvelteMarkdown from 'svelte-markdown'

  export let message: string
</script>

<SvelteMarkdown source={message} renderers={{ code: Code }} />
