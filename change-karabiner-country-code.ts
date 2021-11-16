interface Profile {
  name: string
  virtual_hid_keyboard: {
    country_code: number
  }
}

const HOME = Deno.env.get('HOME')
const CONFIG_PATH = `${HOME}/.config/karabiner/karabiner.json`

const encoder = new TextEncoder()
const decoder = new TextDecoder('UTF-8')
const karabinerConfig = JSON.parse(
  decoder.decode(await Deno.readFile(CONFIG_PATH))
)

const defaultProfile = karabinerConfig.profiles.find(
  (profile: Profile) => profile.name === 'Default'
)

const currentCountryCode =
  defaultProfile['virtual_hid_keyboard']['country_code']
const nextCountryCode = currentCountryCode === 0 ? 46 : 0

defaultProfile['virtual_hid_keyboard']['country_code'] = nextCountryCode

Deno.writeFile(CONFIG_PATH, encoder.encode(JSON.stringify(karabinerConfig)))

console.log(
  `Changing country code from ${currentCountryCode} to ${nextCountryCode}`
)
