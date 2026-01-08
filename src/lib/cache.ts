// Cache and Cookie Management Utilities

export interface CacheItem<T> {
  data: T
  timestamp: number
  expiry?: number
}

export class CacheManager {
  private static instance: CacheManager
  private cache = new Map<string, CacheItem<any>>()
  private cookieConsent: boolean | null = null

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeCookieConsent()
      this.loadFromLocalStorage()
      this.setupEventListeners()
    }
  }

  private initializeCookieConsent() {
    const consent = localStorage.getItem('cookie-consent')
    this.cookieConsent = consent === 'accepted' ? true : consent === 'declined' ? false : null
  }

  private setupEventListeners() {
    window.addEventListener('cookieConsentAccepted', () => {
      this.cookieConsent = true
      this.saveToLocalStorage()
    })

    window.addEventListener('cookieConsentDeclined', () => {
      this.cookieConsent = false
      this.clearAllCache()
    })
  }

  private loadFromLocalStorage() {
    if (!this.cookieConsent) return

    try {
      const cached = localStorage.getItem('retenify-cache')
      if (cached) {
        const data = JSON.parse(cached)
        Object.entries(data).forEach(([key, value]) => {
          this.cache.set(key, value as CacheItem<any>)
        })
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error)
    }
  }

  private saveToLocalStorage() {
    if (!this.cookieConsent) return

    try {
      const cacheObject = Object.fromEntries(this.cache.entries())
      localStorage.setItem('retenify-cache', JSON.stringify(cacheObject))
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error)
    }
  }

  set<T>(key: string, data: T, expiryMinutes?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: expiryMinutes ? Date.now() + (expiryMinutes * 60 * 1000) : undefined
    }

    this.cache.set(key, item)
    
    if (this.cookieConsent) {
      this.saveToLocalStorage()
    }
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) return null

    // Check if expired
    if (item.expiry && Date.now() > item.expiry) {
      this.delete(key)
      return null
    }

    return item.data as T
  }

  delete(key: string): void {
    this.cache.delete(key)
    if (this.cookieConsent) {
      this.saveToLocalStorage()
    }
  }

  clear(): void {
    this.cache.clear()
    if (this.cookieConsent) {
      localStorage.removeItem('retenify-cache')
    }
  }

  private clearAllCache(): void {
    this.cache.clear()
    localStorage.removeItem('retenify-cache')
  }

  // Specific cache methods for different data types
  setChatHistory(userId: string, chats: any[]): void {
    this.set(`chat-history-${userId}`, chats, 60 * 24) // 24 hours
  }

  getChatHistory(userId: string): any[] | null {
    return this.get(`chat-history-${userId}`)
  }

  setUserPreferences(userId: string, preferences: any): void {
    this.set(`user-preferences-${userId}`, preferences, 60 * 24 * 7) // 7 days
  }

  getUserPreferences(userId: string): any | null {
    return this.get(`user-preferences-${userId}`)
  }

  setAuthToken(token: string): void {
    this.set('auth-token', token, 60 * 24) // 24 hours
  }

  getAuthToken(): string | null {
    return this.get('auth-token')
  }

  setRecentSearches(searches: string[]): void {
    this.set('recent-searches', searches.slice(0, 10), 60 * 24 * 3) // 3 days
  }

  getRecentSearches(): string[] | null {
    return this.get('recent-searches')
  }

  setSidebarState(collapsed: boolean): void {
    this.set('sidebar-collapsed', collapsed, 60 * 24 * 30) // 30 days
  }

  getSidebarState(): boolean | null {
    return this.get('sidebar-collapsed')
  }

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.set('theme-preference', theme, 60 * 24 * 365) // 1 year
  }

  getTheme(): 'light' | 'dark' | 'system' | null {
    return this.get('theme-preference')
  }

  // Analytics and usage tracking (only if consent given)
  trackPageView(page: string): void {
    if (!this.cookieConsent) return
    
    const views = this.get<Record<string, number>>('page-views') || {}
    views[page] = (views[page] || 0) + 1
    this.set('page-views', views, 60 * 24 * 7) // 7 days
  }

  trackFeatureUsage(feature: string): void {
    if (!this.cookieConsent) return
    
    const usage = this.get<Record<string, number>>('feature-usage') || {}
    usage[feature] = (usage[feature] || 0) + 1
    this.set('feature-usage', usage, 60 * 24 * 30) // 30 days
  }

  getAnalytics(): { pageViews: Record<string, number>, featureUsage: Record<string, number> } {
    return {
      pageViews: this.get('page-views') || {},
      featureUsage: this.get('feature-usage') || {}
    }
  }
}

// Export singleton instance
export const cache = CacheManager.getInstance()

// Cookie utilities
export const cookieUtils = {
  set(name: string, value: string, days: number = 30): void {
    if (typeof document === 'undefined') return
    
    const expires = new Date()
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
    
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  },

  get(name: string): string | null {
    if (typeof document === 'undefined') return null
    
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  },

  delete(name: string): void {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  },

  hasConsent(): boolean {
    return localStorage.getItem('cookie-consent') === 'accepted'
  }
}