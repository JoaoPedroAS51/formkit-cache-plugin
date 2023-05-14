import '@formkit/themes/genesis'
import { genesisIcons } from '@formkit/icons'
import { DefaultConfigOptions } from '@formkit/vue'
import { createCachePlugin } from '../..'

const config: DefaultConfigOptions = {
  icons: { ...genesisIcons },
  plugins: [createCachePlugin()]
}

export default config
