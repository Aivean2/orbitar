/**
 * PushSubscription shape from web-push.
 * Inlined here to avoid depending on web-push in the shared package.
 */
export type PushSubscriptionJSON = {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export type NotificationsSubscribeRequest = {
  subscription: PushSubscriptionJSON
}

export type NotificationsSubscribeResponse = Record<string, unknown>
