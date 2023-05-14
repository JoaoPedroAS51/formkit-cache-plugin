import type{ FormKitNode, FormKitPlugin } from '@formkit/core'


/**
 * The options to be passed to {@link createCachePlugin|createCachePlugin}
 *
 * @public
 */
export interface CacheOptions {
  //
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
    //
  }

  return cachePlugin
}
