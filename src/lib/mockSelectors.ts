import type { DeliveryZone, MenuCategory, MenuItem, Restaurant } from '../types/domain'
import {
  mockDeliveryZones,
  mockMenuCategories,
  mockMenuItems,
  mockRestaurants,
} from './mockData'

let remoteRestaurants: Restaurant[] = []
let remoteDeliveryZones: DeliveryZone[] = []
let remoteMenuItems: MenuItem[] = []

export function setRemoteRestaurants(restaurants: Restaurant[]): void {
  remoteRestaurants = restaurants
}

export function setRemoteDeliveryZones(zones: DeliveryZone[]): void {
  remoteDeliveryZones = zones
}

export function setRemoteMenuItems(items: MenuItem[]): void {
  remoteMenuItems = items
}

export function getMockRestaurants(): Restaurant[] {
  return remoteRestaurants.length > 0 ? remoteRestaurants : mockRestaurants
}

export function getMockDeliveryZones(): DeliveryZone[] {
  return remoteDeliveryZones.length > 0 ? remoteDeliveryZones : mockDeliveryZones
}

export function getMockMenuCategories(): MenuCategory[] {
  return mockMenuCategories
}

export function getMockMenuItems(): MenuItem[] {
  return remoteMenuItems.length > 0 ? remoteMenuItems : mockMenuItems
}

export function findMockRestaurantById(id: string): Restaurant | undefined {
  return getMockRestaurants().find((restaurant) => restaurant.id === id)
}

export function findMockMenuItemById(id: string): MenuItem | undefined {
  return getMockMenuItems().find((item) => item.id === id)
}

export function findMockDeliveryZoneById(id: string): DeliveryZone | undefined {
  return getMockDeliveryZones().find((zone) => zone.id === id)
}
