import { defineNuxtModule, addImports, addPlugin, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-usefetchquery',
    configKey: 'myModule'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve('./runtime/plugin'))
    addPlugin(resolver.resolve('./runtime/plugins/useFetchQuery.client'))
    addPlugin(resolver.resolve('./runtime/plugins/useFetchQuery.server'))
    //addPlugin(resolver.resolve('./runtime/plugin'))

  

    // addImports({
    //   name: 'useComposable', // name of the composable to be used
    //   as: 'useComposable', 
    //   from: resolver.resolve('runtime/composables/useComposable') // path of composable 
    // })
    addImports({
      name: 'useFetchQuery', // name of the composable to be used
      as: 'useFetchQuery', 
      from: resolver.resolve('runtime/composables/useFetchQuery') // path of composable 
    })
  }
})

//import { defineNuxtModule, addImports, createResolver } from '@nuxt/kit'

// export default defineNuxtModule({
//   setup(options, nuxt) {
//     const resolver = createResolver(import.meta.url)

//     addImports({
//       name: 'useComposable', // name of the composable to be used
//       as: 'useComposable', 
//       from: resolver.resolve('runtime/composables/useComposable') // path of composable 
//     })
//   }
// })
