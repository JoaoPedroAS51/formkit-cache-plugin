import '@formkit/themes/genesis'
import { genesisIcons } from '@formkit/icons'
import { DefaultConfigOptions } from '@formkit/vue'
import { createCachePlugin } from '../..'
import localStorageDriver from 'unstorage/drivers/localstorage'

const config: DefaultConfigOptions = {
  icons: { ...genesisIcons },
  plugins: [
    createCachePlugin({
      driver: localStorageDriver()
    })
  ]
}

export default config
