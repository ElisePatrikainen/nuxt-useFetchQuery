export default defineNuxtPlugin((nuxtApp) => {
  let useFetchQuery = {};
  if (nuxtApp.payload && nuxtApp.payload.useFetchQuery) {
    useFetchQuery = { ...nuxtApp.payload.useFetchQuery };
  }
  return {
    provide: {
      useFetchQuery,
    },
  };
});
