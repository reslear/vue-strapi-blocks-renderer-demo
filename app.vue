<script setup lang="ts">
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
import data from '~/assets/data.json'
import pretty from 'pretty'

const route = useRoute()
const router = useRouter()

const input = ref(JSON.stringify(data, null, 2))

const content = computed(() => {
  try {
    return JSON.parse(input.value)
  } catch (e) {
    console.error(e)
    return null
  }
})
const isParsingError = computed(() => !content.value)

const tabs = ref([
  {
    key: 'output',
    label: 'Output',
    icon: 'i-heroicons-newspaper-16-solid'
  },
  {
    key: 'html',
    label: 'Html',
    icon: 'i-heroicons-code-bracket-16-solid'
  }
])

const selectedTab = computed({
  get() {
    const index = tabs.value.findIndex(item => item.key === route.query.tab)
    return index === -1 ? 0 : index
  },
  set(value: number) {
    const tab = tabs.value[value].key
    router.replace({ query: { tab } })
  }
})

const outputRef = ref()
const outputHtml = ref('')

function setOutputHtml() {
  const html: string = outputRef.value?.innerHTML ?? ''
  if (!html) return
  outputHtml.value = pretty(html)
}

watchEffect(() => {
  if (content.value) setOutputHtml()
})

const { copy } = useClipboard()

async function paste() {
  const text = await navigator.clipboard.readText()
  input.value = text
}
</script>

<template>
  <UContainer class="mt-4">
    <div class="flex items-center justify-center my-4">
      <div class="flex items-center gap-4">
        <span class="text-primary text-3xl font-bold">Demo</span>
        <div class="text-primary text-3xl font-bold flex items-center gap-2">
          <UIcon class="text-3xl" dynamic name="i-logos-strapi-icon"></UIcon>
          <NuxtLink
            to="https://github.com/niklasfjeldberg/vue-strapi-blocks-renderer/"
            class="underline"
            target="_blank"
          >
            <span>Vue Strapi Blocks Renderer</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <div class="flex justify-between items-center">
          <p>Strapi right text (blocks) content:</p>
        </div>
        <div class="relative">
          <UButton
            label="Paste"
            icon="i-heroicons-clipboard"
            color="gray"
            variant="ghost"
            class="absolute top-2 right-2 z-10"
            @click="paste()"
          />
          <UTextarea v-model="input" :rows="10" resize />
        </div>
      </div>

      <UAlert
        v-if="isParsingError"
        color="red"
        variant="soft"
        description="Error parsing JSON"
      />

      <UTabs v-model="selectedTab" :items="tabs" v-if="!isParsingError">
        <template #default="{ item, index, selected }">
          <div
            class="flex items-center gap-2 relative truncate"
            :class="{ 'text-primary': selected }"
          >
            <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

            <span class="truncate">{{ item.label }}</span>
          </div>
        </template>

        <template #item="{ item }">
          <article v-show="item.key === 'output'" class="prose">
            <StrapiBlocks v-if="content" ref="outputRef" :content="content" />
          </article>

          <div v-show="item.key === 'html'" class="relative">
            <UButton
              class="absolute top-2 right-2 z-10"
              label="Copy"
              icon="i-heroicons-clipboard-document"
              color="gray"
              variant="ghost"
              @click="copy(outputHtml)"
            />
            <UTextarea :value="outputHtml" :rows="20" readonly resize />
          </div>
        </template>
      </UTabs>

      <UDivider />
      <div class="text-center my-4 flex justify-center gap-2">
        <span>
          by
          <NuxtLink class="text-primary" href="https://github.com/reslear"
            >@reslear</NuxtLink
          >
        </span>
        |
        <NuxtLink
          class="text-primary flex items-center gap-1"
          href="https://github.com/reslear/vue-strapi-blocks-renderer-demo"
        >
          <UIcon name="i-simple-icons-github" />
          <span>Source</span>
        </NuxtLink>
      </div>
    </div>
  </UContainer>
</template>
