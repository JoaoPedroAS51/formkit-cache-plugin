import type { FormKitNode, FormKitPlugin } from '@formkit/core'
import { undefine } from '@formkit/utils'
import { createStorage, type Driver } from 'unstorage'

declare module '@formkit/core' {
  interface FormKitNodeExtensions {
    props: Partial<{
      cache: boolean
    }>
    clearCache: () => Promise<void>
  }
}

/**
 * The options to be passed to {@link createCachePlugin | createCachePlugin}
 *
 * @param prefix - The prefix to use for the local storage key
 * @param key - The key to use for the local storage entry, useful for scoping data per user
 * @param control - The form control to use enable or disable saving to storage. Must return a boolean value.
 * @param maxAge - The maximum age of the local storage entry in milliseconds
 * @param debounce - The debounce time in milliseconds to use when saving to localStorage
 * @param beforeSave - A function to call for modifying data before saving to localStorage
 * @param beforeLoad - A function to call for modifying data before loading from localStorage
 *
 * @public
 */
export interface CacheOptions {
  prefix?: string
  key?: string | number
  control?: string
  maxAge?: number
  debounce?: number
  beforeSave?: (payload: any) => any
  beforeLoad?: (payload: any) => any
  driver?: Driver
}

/**
 * The value returned from the storage
 */
interface CacheValue {
  maxAge: number
  data: unknown
}

/**
 * Creates a new lazy plugin.
 *
 * @param cacheOptions - The options of {@link CacheOptions|CacheOptions} to pass to the plugin
 *
 * @returns A {@link @formkit/core#FormKitPlugin|FormKitPlugin}
 *
 * @public
 */
export function createCachePlugin(cacheOptions?: CacheOptions): FormKitPlugin {
  const cachePlugin = (node: FormKitNode) => {
    // only apply if internal FormKit type is 'group'. This applies
    // to 'form' and 'group' inputs — as well as any add-on inputs
    // registered of FormKit type 'group' (eg. 'multi-step').
    if (node.type !== 'group') {
      return
    }

    // enable SSR support
    if (typeof window === 'undefined') {
      return
    }

    let cachedStorageData: CacheValue | undefined
    const shouldUseCache = (controlNode: FormKitNode | undefined) => {
      let controlFieldValue = true
      if (controlNode) {
        controlFieldValue = controlNode.value === true
      }
      return undefine(node.props.cache) && controlFieldValue
    }

    node.on('created', async () => {
      await node.settled

      node.addProps(['cache'])
      node.extend('restoreCache', {
        get: (node) => async () => {
          if (!cachedStorageData) {
            return
          }
          await node.settled
          await loadValue(cachedStorageData)
        },
        set: false,
      })
      node.extend('clearCache', {
        get: (node) => async () => {
          await clearValue()
        },
        set: false,
      })

      // if the user provided a control field, then we need to listen for changes
      // and use it to determine whether or not to use local storage
      // if the user provided a control field, then we need to listen for changes
      // and use it to determine whether or not to use local storage
      const controlField = cacheOptions?.control ?? undefined
      let controlNode: FormKitNode | undefined
      if (typeof controlField === 'string') {
        const controlNode = node.at(controlField)
        if (controlNode) {
          controlNode.on('commit', () => {
            useCache = shouldUseCache(controlNode)
            if (!useCache) {
              clearValue()
            }
          })
        }
      }

      let useCache = shouldUseCache(controlNode)
      let saveTimeout: ReturnType<typeof setTimeout> | number = 0
      const {
        prefix = 'formkit',
        maxAge = 3_600_000,
        debounce = 200,
        driver,
      } = cacheOptions ?? {}

      const storage = createStorage({ driver })
      const key = cacheOptions?.key ? `:${cacheOptions.key}` : '' // for scoping to a specific user
      const storageKey = `${prefix}${key}:${node.name}`

      if (!storageKey) {
        console.log(`[FormKit] Missing cache key for ${node.name}`)
        return
      }

      const loadValue = async (forceValue?: CacheValue) => {
        const value =
          forceValue ||
          ((await storage.getItem(storageKey)) as CacheValue | undefined)

        if (!value) {
          return
        }

        if (typeof cacheOptions?.beforeLoad === 'function') {
          node.props.disabled = true
          try {
            value.data = await cacheOptions.beforeLoad(value.data)
          } catch (error) {
            console.error(error)
          }
          node.props.disabled = false
        }

        if (!value || typeof value.data !== 'object') {
          return
        }

        await (value.maxAge > Date.now()
          ? node.input(value.data, false)
          : clearValue())
      }

      const saveValue = async (payload: unknown) => {
        let savePayload = payload

        if (typeof cacheOptions?.beforeSave === 'function') {
          try {
            savePayload = await cacheOptions.beforeSave(payload)
          } catch (error) {
            console.error(error)
          }
        }

        if (!savePayload) {
          return
        }

        await storage.setItem(storageKey, {
          maxAge: Date.now() + maxAge,
          data: savePayload,
        })
      }

      const clearValue = async () => {
        await storage.removeItem(storageKey)
      }

      node.on('commit', ({ payload }) => {
        if (!useCache) {
          return
        }

        // debounce the save to local storage
        clearTimeout(saveTimeout)
        saveTimeout = setTimeout(() => saveValue(payload), debounce)
      })

      node.on('prop:cache', async () => {
        useCache = shouldUseCache(controlNode)
        if (!useCache) {
          await clearValue()
        }
      })

      node.hook.submit(async (payload, next) => {
        // cache data in case the user wants to restore
        cachedStorageData = (await storage.getItem(storageKey)) as
          | CacheValue
          | undefined
        // remove from the localStorage cache
        await clearValue()
        return next(payload)
      })

      await loadValue()
    })
  }

  return cachePlugin
}
