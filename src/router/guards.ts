import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../stores/auth.ts'

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  if (!authStore.token) {
    next({ 
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export const guestGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  if (authStore.token) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
}

export const roleGuard = (roles: string[]) => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()
    
    if (!authStore.token) {
      next({ 
        name: 'Login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    const userRoles = authStore.user?.roles ?? []
    const hasPermission = roles.some(role => userRoles.includes(role))
    
    if (!hasPermission) {
      next({ name: 'Forbidden' })
    } else {
      next()
    }
  }
}