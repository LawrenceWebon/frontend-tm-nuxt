declare global {
  const useRouter: typeof import('vue-router')['useRouter']
  const useRoute: typeof import('vue-router')['useRoute']
  const navigateTo: typeof import('nuxt/app')['navigateTo']
  const computed: typeof import('vue')['computed']
  const ref: typeof import('vue')['ref']
  const onMounted: typeof import('vue')['onMounted']
}

export {}
