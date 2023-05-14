import '@formkit/themes/genesis'
import { genesisIcons } from '@formkit/icons'
import { DefaultConfigOptions } from '@formkit/vue'
import { createMyPlugin } from '../..'

const config: DefaultConfigOptions = {
  icons: { ...genesisIcons },
  plugins: [createMyPlugin()]
}

export default config
