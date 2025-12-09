/**
 * ARIA PWA - Push Notifications Module
 * Handles push notification registration and permissions
 * 
 * Phase 6 will activate this with VAPID keys
 */

const Push = {
  // VAPID public key - to be filled in Phase 6
  vapidPublicKey: null,

  /**
   * Check if push notifications are supported
   * @returns {boolean}
   */
  isSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },

  /**
   * Request notification permission
   * @returns {Promise<string>} - 'granted', 'denied', or 'default'
   */
  async requestPermission() {
    if (!this.isSupported()) {
      console.log('[Push] Push notifications not supported');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    console.log('[Push] Permission:', permission);
    return permission;
  },

  /**
   * Subscribe to push notifications
   * @returns {Promise<PushSubscription|null>}
   */
  async subscribe() {
    if (!this.vapidPublicKey) {
      console.log('[Push] VAPID key not configured');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      console.log('[Push] Subscribed:', subscription.endpoint);
      
      // Send subscription to backend
      const success = await API.registerPushSubscription(subscription);
      if (success) {
        console.log('[Push] Subscription registered with backend');
      }

      return subscription;
    } catch (error) {
      console.error('[Push] Subscription failed:', error);
      return null;
    }
  },

  /**
   * Unsubscribe from push notifications
   * @returns {Promise<boolean>}
   */
  async unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        console.log('[Push] Unsubscribed');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[Push] Unsubscribe failed:', error);
      return false;
    }
  },

  /**
   * Check current subscription status
   * @returns {Promise<PushSubscription|null>}
   */
  async getSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      return await registration.pushManager.getSubscription();
    } catch (error) {
      console.error('[Push] getSubscription failed:', error);
      return null;
    }
  },

  /**
   * Convert VAPID key from base64 to Uint8Array
   * @param {string} base64String 
   * @returns {Uint8Array}
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
};

// Export for use in app.js
window.Push = Push;
