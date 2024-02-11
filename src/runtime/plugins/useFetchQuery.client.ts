export default defineNuxtPlugin((nuxtApp) => {
  let useFetchQuery = {};
  console.log("from plugin", nuxtApp.payload.useFetchQuery);
  
  if (nuxtApp.payload && nuxtApp.payload.useFetchQuery) {
    useFetchQuery = { ...nuxtApp.payload.useFetchQuery };
  }
  return {
    provide: {
      useFetchQuery,
    },
  };
});
