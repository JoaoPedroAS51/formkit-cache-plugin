import type { FormKitNode, FormKitPlugin } from '@formkit/core'
import { undefine } from '@formkit/utils'

/**
 * The options to be passed to {@link createCachePlugin|createCachePlugin}
 *
 * @public
 */
export interface CacheOptions {
  prefix?: string
  maxAge?: number
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

    node.on('created', () => {
      const cache = undefine(node.props.cache)
      if (!cache) {
        return
      }

      const prefix = CacheOptions?.prefix ?? 'formkit'
      const maxAge = CacheOptions?.maxAge ?? 3_600_000 // 1 hour
      const key = `${prefix}-${node.name}`
      const value = localStorage.getItem(key)

      if (value) {
        const localStorageValue = JSON.parse(value)
        if (localStorageValue.maxAge > Date.now()) {
          node.input(localStorageValue.data)
        } else {
          localStorage.removeItem(key)
        }
      }

      node.on('commit', ({ payload }) => {
        localStorage.setItem(
          key,
          JSON.stringify({
            maxAge: Date.now() + maxAge,
            data: payload,
          })
        )
      })

      node.hook.submit((payload, next) => {
        localStorage.removeItem(key)
        return next(payload)
      })
    })
  }

  return cachePlugin
}
