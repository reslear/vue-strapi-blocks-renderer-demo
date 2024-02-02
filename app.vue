<script setup lang="ts">
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
import { html_beautify } from 'js-beautify'
const route = useRoute()
const router = useRouter()

const inputRef = ref()
const input = ref('')

onMounted(() => {
  import('~/assets/data.json').then(data => {
    input.value = JSON.stringify(data.default, null, 2)
  })
})

const content = computed(() => {
  if (!input.value) return null
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

async function setOutputHtml() {
  const html: string = outputRef.value?.innerHTML ?? ''
  if (!html) return
  outputHtml.value = html_beautify(html)
}

watchEffect(async () => {
  if (content.value) await setOutputHtml()
})

const { copy, copied } = useClipboard()

async function paste() {
  const text = await navigator.clipboard.readText()
  input.value = text
}

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>

<template>
  <UContainer class="mt-4">
    <div class="flex items-center justify-center my-4">
      <div class="text-primary text-3xl font-bold">
        <span class="pr-2">Demo</span>
        <NuxtLink
          to="https://github.com/niklasfjeldberg/vue-strapi-blocks-renderer/"
          class="underline"
          target="_blank"
        >
          <UIcon class="text-3xl mr-2" dynamic name="i-logos-strapi-icon" />Vue
          Strapi Blocks Renderer
        </NuxtLink>
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
            color="primary"
            variant="soft"
            class="absolute top-2 right-2 z-10"
            @click="paste()"
          />
          <UTextarea ref="inputRef" v-model="input" :rows="10" resize />
        </div>
      </div>

      <UAlert
        v-if="isParsingError && input.length"
        color="red"
        variant="soft"
        description="Error parsing JSON"
        title=""
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
          <article
            v-show="item.key === 'output'"
            class="prose dark:prose-invert"
          >
            <StrapiBlocks v-if="content" ref="outputRef" :content="content" />
          </article>

          <div v-show="item.key === 'html'" class="relative">
            <UButton
              class="absolute top-2 right-2 z-10"
              label="Copy"
              :icon="
                copied
                  ? 'i-heroicons-check-16-solid'
                  : 'i-heroicons-clipboard-document'
              "
              color="primary"
              variant="soft"
              @click="copy(outputHtml)"
            >
            </UButton>
            <UTextarea :value="outputHtml" :rows="20" readonly resize />
          </div>
        </template>
      </UTabs>

      <UDivider />
      <div class="my-4 flex items-center justify-center gap-6">
        <UButton
          :icon="
            isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
          "
          color="gray"
          variant="ghost"
          aria-label="Theme"
          @click="isDark = !isDark"
        />

        <span>
          by
          <NuxtLink class="text-primary" href="https://github.com/reslear"
            >@reslear</NuxtLink
          >
        </span>

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
