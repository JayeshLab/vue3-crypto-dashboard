<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, useTemplateRef, nextTick } from 'vue'

interface Props {
  options: (string | Record<string, any>)[]
  labelKey?: string
  valueKey?: string
  placeholder?: string
  modelValue?: any
  searchable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  labelKey: 'label',
  valueKey: 'value',
  placeholder: 'Select an option',
  searchable: true
})

// v-model
const emit = defineEmits(['update:modelValue', 'input'])

const isOpen = ref(false)
const searchQuery = ref('')
const selectedOption = ref<any>(null)
const searchInput = useTemplateRef('search-input')
// Filter dropdown list based on search input
const filteredOptions = computed(() => {
  console.log(searchQuery.value);
  return props.options.filter((option) => {
    const label = typeof option === 'string' ? option : option[props.labelKey]
    return label.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const getOptionLabel = (option: any): string => {
  return typeof option === 'string' ? option : option[props.labelKey]
}

const getOptionValue = (option: any): any => {
  return typeof option === 'string' ? option : option[props.valueKey]
}

const selectOption = (option: any) => {
  selectedOption.value = option
  emit('update:modelValue', getOptionValue(option))
  emit('input')
  isOpen.value = false
  searchQuery.value = ''
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    searchQuery.value = ''
  }
  else {
    nextTick(() => {
      searchInput.value?.focus();
    })
  }
}

// Close dropdown when clicking outside
const dropdownRef = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
    searchQuery.value = ''
  }
}
const updateSearchQuery = (e: Event) => {
  searchQuery.value =  (e.target as HTMLInputElement).value;
}
// Watch for modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === undefined || newValue === null) {
      selectedOption.value = null
      return
    }

    const option = props.options.find((opt) => getOptionValue(opt) === newValue)
    selectedOption.value = option
  },
  { immediate: true }
)

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Remove listener on click outside
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="dropdown-container" ref="dropdownRef">
    <div class="dropdown-trigger" @click="toggleDropdown">
      <span v-if="selectedOption">{{ getOptionLabel(selectedOption) }}</span>
      <span v-else class="placeholder">{{ placeholder }}</span>
      <span class="arrow" :class="{ open: isOpen }">▼</span>
    </div>

    <div v-show="isOpen" class="dropdown-menu">
      <input
        v-if="searchable"
        type="text"
        placeholder="Search..."
        ref="search-input"
        class="search-input"
        :value="searchQuery"
        @input="updateSearchQuery"
        @click.stop
      />
      <div class="options-container">
        <div
          v-for="option in filteredOptions"
          :key="getOptionValue(option)"
          class="option"
          :class="{
            selected: selectedOption && getOptionValue(selectedOption) === getOptionValue(option)
          }"
          @click="selectOption(option)"
        >
          {{ getOptionLabel(option) }}
        </div>
        <div v-if="filteredOptions.length === 0" class="no-results">No results found</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
  width: 100%;
  max-width: 300px;
}

.dropdown-trigger {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.placeholder {
  color: #999;
}

.arrow {
  font-size: 0.8em;
  transition: transform 0.2s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.search-input {
  width: calc(100% - 16px);
  padding: 8px;
  border: none;
  border-bottom: 1px solid #ddd;
  margin: 0;
}

.search-input:focus {
  outline: none;
}

.options-container {
  max-height: 200px;
  overflow-y: auto;
}

.option {
  padding: 8px 12px;
  cursor: pointer;
}

.option:hover {
  background-color: #f5f5f5;
}

.option.selected {
  background-color: #e6f7ff;
}

.no-results {
  padding: 8px 12px;
  color: #999;
  text-align: center;
}
</style>
