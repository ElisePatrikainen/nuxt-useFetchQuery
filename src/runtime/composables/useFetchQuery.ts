import { useNuxtApp } from "#app";
import { UseFetchOptions, useFetch, useRoute } from "#app/composables";
import { ref } from "vue";

interface UseFetchQueryOptions<T> extends UseFetchOptions<T> {
  refreshTime?: number | "infinite";
  refreshOnFocus?: boolean;
  refreshOnReconnect?: boolean;
  suspenseOnRefresh?: boolean;
}

interface UseFetchQueryKeyCache {
  lastFetch?: string;
  routes?: string[];
  refreshOnFocusCb?: Function;
  refreshOnReconnectCb?: Function;
}

function initUseFetchQueryKeyCache(key: string) {
  const nuxtApp = useNuxtApp();
  if (process.server && !nuxtApp.payload.useFetchQuery[key]) {
    // TODO: do a real typing
    (useNuxtApp().payload.useFetchQuery[key] as UseFetchQueryKeyCache) = {};
  }
  if (!process.server && !useNuxtApp().$useFetchQuery[key]) {
    // TODO: do a real typing
    (useNuxtApp().$useFetchQuery[key] as UseFetchQueryKeyCache) = {};
  }
}

function optionsChecksAndDefaults(options: UseFetchQueryOptions<any>) {
  const _options = { ...options };
  if (Number.isNaN(_options.refreshTime)) {
    console.warn(
      `[useFetchQuery] refreshTime should be a number, received ${_options.refreshTime} instead.`
    );
    _options.refreshTime = null;
  }
  // TODO: use defu ?
  _options.refreshOnFocus = _options.refreshOnFocus ?? true;
  _options.refreshOnReconnect = _options.refreshOnReconnect ?? true;
  return _options;
}

function isCacheExpired(key: string, refreshTime: number) {
  let requestTimestamp;
  if (process.server) {
    requestTimestamp = useNuxtApp().payload.useFetchQuery[key];
  } else {
    requestTimestamp = useNuxtApp().$useFetchQuery[key].lastFetch;
  }
  if (!requestTimestamp) return true;
  const expirationDate = new Date(requestTimestamp);
  expirationDate.setTime(expirationDate.getTime() + refreshTime);
  return expirationDate.getTime() < Date.now();
}

function registerFetchTimestamp(key) {
  if (process.server) {
    useNuxtApp().payload.useFetchQuery[key].lastFetch =
      new Date().toISOString();
  } else {
    useNuxtApp().$useFetchQuery[key].lastFetch = new Date().toISOString();
  }
}

function registerCurrentPath(key) {
  const { path } = useRoute();
  useNuxtApp().$useFetchQuery[key].routes = [];
  if (!useNuxtApp().$useFetchQuery[key].routes.includes(path)) {
    useNuxtApp().$useFetchQuery[key].routes.push(path);
  }
}

function registerWindowFocusEventListener(key, refreshFunction) {
  if (!useNuxtApp().$useFetchQuery[key].refreshOnFocusCb) {
    useNuxtApp().$useFetchQuery[key].refreshOnFocusCb = () => {
      const isDocumentVisible = document.visibilityState === "visible";
      const { path } = useRoute();
      const fetchIsNeededOnCurrentPage =
        useNuxtApp().$useFetchQuery[key].routes.includes(path);
      // TODO: add the cache expiration check
      if (isDocumentVisible && fetchIsNeededOnCurrentPage) refreshFunction();
    };
    window?.addEventListener(
      "visibilitychange",
      useNuxtApp().$useFetchQuery[key].refreshOnFocusCb
    );
    // TODO: expose a way to remove the event listener
  }
}

function registerReconnectEventListener(key, refreshFunction) {
  // TODO: see why a double request is emitted on reconnection
  if (!useNuxtApp().$useFetchQuery[key].refreshOnReconnectCb) {
    useNuxtApp().$useFetchQuery[key].refreshOnReconnectCb = () => {
      const { path } = useRoute();
      const fetchIsNeededOnCurrentPage =
        useNuxtApp().$useFetchQuery[key].routes.includes(path);
      // TODO: add the cache expiration check
      if (fetchIsNeededOnCurrentPage) refreshFunction();
    };
    window?.addEventListener(
      "online",
      useNuxtApp().$useFetchQuery[key].refreshOnReconnectCb
    );
    // TODO: expose a way to remove the event listener
  }
}

export async function useFetchQuery<T>(
  url: string,
  options: UseFetchQueryOptions<T> = {}
) {
  const _key = url; // temporary 'shortcut' - TODO: use the same key as `useFetch` (with hashing including option segments)
  initUseFetchQueryKeyCache(_key);
  if (process.client) {
    // records the routes where this fetch is used (for triggering window events revalidation only on these routes)
    registerCurrentPath(_key);
  }

  const nuxtApp = useNuxtApp();
  const data = nuxtApp.payload.data[_key];
  const _options = optionsChecksAndDefaults(options);
  const refreshing = ref(false);

  const useFetchOptions: UseFetchOptions<T> = {
    dedupe: "defer", // TODO: keep defer forced ?
    baseURL: "",
    key: _key,
    lazy: _options.suspenseOnRefresh ? false : !!data, // to not show Suspense on revalidation
    getCachedData(_key) {
      if (!data || !_options.refreshTime) return;
      if (
        nuxtApp.isHydrating ||
        _options.refreshTime === "infinite" ||
        !isCacheExpired(_key, _options.refreshTime)
      )
        return data;
      else {
        refreshing.value = true;
        return;
      }
    },
    onRequest(ctx) {
      // TODO : add the user `onRequest` interceptor
      registerFetchTimestamp(_key);
    },
    onResponse(ctx) {
      // TODO : add the user `onResponse` interceptor
      refreshing.value = false;
    },
    onResponseError(ctx) {
      // TODO : add the user `onResponseError` interceptor
      refreshing.value = false;
    },
  };

  const _useFetch = await useFetch(_key, useFetchOptions);

  // Revalidation on events
  if (process.client) {
    if (_options.refreshOnFocus)
      registerWindowFocusEventListener(_key, _useFetch.refresh);
    if (_options.refreshOnReconnect)
      registerReconnectEventListener(_key, _useFetch.refresh);
  }

  Object.assign(_useFetch, { refreshing });

  return _useFetch;
}
