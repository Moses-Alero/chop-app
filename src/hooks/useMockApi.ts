import { useCallback, useMemo } from 'react'
import type {
  Order,
  OrderHistoryEntry,
  RestaurantMenuResult,
  SearchCatalogResult,
} from '../types/domain'
import {
  fetchLocationsFromBackend,
  fetchOrderHistoryFromBackend,
  fetchRestaurantDetailFromBackend,
  fetchRestaurantMenuFromBackend,
  fetchRestaurantsFromBackend,
  fetchSearchCatalogFromBackend,
  shouldUseBackendApp,
} from '../lib/backendApi'
import {
  fetchDeliveryZones as fetchMockDeliveryZones,
  fetchOrderHistory,
  fetchRestaurantMenu as fetchMockRestaurantMenu,
  fetchRestaurants as fetchMockRestaurants,
  fetchSearchCatalog as fetchMockSearchCatalog,
  getOrder,
} from '../lib/mockApi'
import { findMockMenuItemById, findMockRestaurantById } from '../lib/mockSelectors'
import { useAuth } from '../context/AuthContext'
import { useAsyncResource } from './useAsyncResource'

export function useRestaurants() {
  const loader = useCallback(() => (shouldUseBackendApp() ? fetchRestaurantsFromBackend() : fetchMockRestaurants()), [])
  return useAsyncResource(loader, [shouldUseBackendApp()])
}

export function useOrderHistory() {
  const { mode, token } = useAuth()
  const loader = useCallback<() => Promise<OrderHistoryEntry[]>>(
    () => {
      if (mode === 'backend') return token ? fetchOrderHistoryFromBackend(token) : Promise.resolve([])
      return fetchOrderHistory()
    },
    [mode, token],
  )

  return useAsyncResource(loader, [mode, token])
}

export function useSearchCatalog(query: string) {
  const loader = useCallback<() => Promise<SearchCatalogResult>>(
    () => (shouldUseBackendApp() ? fetchSearchCatalogFromBackend(query) : fetchMockSearchCatalog(query)),
    [query],
  )
  return useAsyncResource(loader, [query, shouldUseBackendApp()])
}

export function useRestaurantMenu(restaurantId: string) {
  const loader = useCallback<() => Promise<RestaurantMenuResult>>(
    () => (shouldUseBackendApp() ? fetchRestaurantMenuFromBackend(restaurantId) : fetchMockRestaurantMenu(restaurantId)),
    [restaurantId],
  )
  return useAsyncResource(loader, [restaurantId, shouldUseBackendApp()])
}

export function useRestaurantDetail(restaurantId: string) {
  const loader = useCallback<() => Promise<RestaurantMenuResult>>(
    () => (shouldUseBackendApp() ? fetchRestaurantDetailFromBackend(restaurantId) : fetchMockRestaurantMenu(restaurantId)),
    [restaurantId],
  )
  return useAsyncResource(loader, [restaurantId, shouldUseBackendApp()])
}

export function useDeliveryZones() {
  const loader = useCallback(() => (shouldUseBackendApp() ? fetchLocationsFromBackend() : fetchMockDeliveryZones()), [])
  return useAsyncResource(loader, [shouldUseBackendApp()])
}

export function useOrder(orderId: string) {
  const loader = useCallback<() => Promise<Order>>(() => getOrder(orderId), [orderId])
  return useAsyncResource(loader, [orderId])
}

export function useRestaurant(restaurantId: string | null | undefined) {
  return useMemo(() => {
    if (!restaurantId) return null
    return findMockRestaurantById(restaurantId) ?? null
  }, [restaurantId])
}

export function useMenuItem(itemId: string | null | undefined) {
  return useMemo(() => {
    if (!itemId) return null
    return findMockMenuItemById(itemId) ?? null
  }, [itemId])
}

export const useMockApi = {
  useRestaurants,
  useOrderHistory,
  useSearchCatalog,
  useRestaurantMenu,
  useRestaurantDetail,
  useDeliveryZones,
  useOrder,
  useRestaurant,
  useMenuItem,
}
