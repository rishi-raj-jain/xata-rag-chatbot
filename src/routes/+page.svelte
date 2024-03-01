<script lang="ts">
  import { useChat } from 'ai/svelte'
  import MemoizedMD from '@/markdown/MemoizedMD.svelte'
  import ChevronRight from '@/icons/ChevronRight.svelte'
  import InputElement from '@/lib/components/ui/input/input.svelte'

  const { input, handleSubmit, messages } = useChat()

  function capitalizeFirstLetter(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1)
  }
</script>

<div class="flex flex-col items-center">
  <div class="relative flex w-full max-w-lg flex-col items-start overflow-hidden px-5">
    <form on:submit={handleSubmit} class="fixed bottom-4 flex w-[75vw] max-w-[500px] flex-row items-center space-x-2">
      <InputElement
        id="message"
        type="message"
        autocomplete="off"
        bind:value={$input}
        placeholder="What's your next question?"
        class="rounded border-black/25 placeholder:text-black/75 hover:border-black"
      />
      <button class="absolute right-3 flex size-6 flex-col items-center justify-center rounded-full border border-black/50 hover:bg-black hover:text-white" type="submit">
        <ChevronRight />
      </button>
    </form>
    <div class="flex max-h-[90vh] w-full flex-col overflow-y-scroll">
      {#each $messages as message}
        <div class="mt-3 h-[1px] w-full bg-white" />
        <span class="max-w-max rounded border px-2 py-1 text-xs">
          {capitalizeFirstLetter(message.role)}
        </span>
        <div class="mt-2 h-[1px] w-full bg-white" />
        <MemoizedMD message={message.content} />
        <div class="mt-3 h-[1px] bg-black/10" />
      {/each}
    </div>
  </div>
</div>
