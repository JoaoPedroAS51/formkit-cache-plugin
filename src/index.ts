import type{ FormKitNode, FormKitPlugin } from '@formkit/core'


/**
 * The options to be passed to {@link createMyPlugin|createMyPlugin}
 *
 * @public
 */
export interface MyPluginOptions {
  //
}

/**
 * Creates a new lazy plugin.
 *
 * @param MyPluginOptions - The options of {@link MyPluginOptions|MyPluginOptions} to pass to the plugin
 *
 * @returns A {@link @formkit/core#FormKitPlugin|FormKitPlugin}
 *
 * @public
 */
export function createMyPlugin(MyPluginOptions?: MyPluginOptions): FormKitPlugin {
  const myPlugin = (node: FormKitNode) => {
    //
  }

  return myPlugin
}
