import type { FormKitNode, FormKitPlugin } from '@formkit/core'
import { undefine } from '@formkit/utils'
import { createStorage, type Driver } from 'unstorage'

declare module '@formkit/core' {
  interface FormKitNodeExtensions {
    props: Partial<{
      cache: CacheProp | false
    }>
    clearCache: () => void
  }
}

/**
 * The options to be passed to {@link createCachePlugin|createCachePlugin}
 *
 * @public
 */
export interface CacheOptions {
  /* @default 'formkit' */
  prefix?: string
  /* @default 3_600_000 */
  maxAge?: number
  driver: Driver
}

/**
 * The options to be passed to cache prop
 *
 * @public
 */
export interface CacheProp {
  key: string
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
 * @param CacheOptions - The options of {@link CacheOptions|CacheOptions} to pass to the plugin
 *
 * @returns A {@link @formkit/core#FormKitPlugin|FormKitPlugin}
 *
 * @public
 */
export function createCachePlugin(CacheOptions?: CacheOptions): FormKitPlugin {
  const cachePlugin = (node: FormKitNode) => {
    if (node.props.type !== 'form') {
      return
    }
    node.addProps(['cache'])

    node.on('created', async () => {
      const cache = undefine(node.props.cache)
      if (!cache) {
        return
      }

      const {
        prefix = 'formkit',
        maxAge = 3_600_000,
        driver,
      } = CacheOptions ?? {}

      if (!driver) {
        console.log(`[FormKit] Storage driver is required for cache plugin`)
        return
      }

      const storage = createStorage({ driver })

      const { key: cacheKey } = node.props.cache as CacheProp

      if (!cacheKey) {
        console.log(`[FormKit] Missing cache key for ${node.name}`)
        return
      }

      const key = `${prefix}-${cacheKey}`
      const value = (await storage.getItem(key)) as CacheValue | undefined

      if (value) {
        await (value.maxAge > Date.now()
          ? node.input(value.data)
          : storage.removeItem(key))
      }

      node.on('commit', async ({ payload }) => {
        await storage.setItem(key, {
          maxAge: Date.now() + maxAge,
          data: payload,
        })
      })

      node.clearCache = () => storage.removeItem(key)
      // TODO: Listen to submit:success event
      node.hook.submit(async (payload, next) => {
        await node.clearCache()
        return next(payload)
      })
      node.on('reset', async () => {
        await node.settled
        await node.clearCache()
      })
    })
  }

  return cachePlugin
}
