<script lang="ts">
  import Highlight from 'svelte-highlight'
  import typescript from 'svelte-highlight/languages/typescript'

  export let text: any
</script>

<Highlight language={typescript} code={text} />
