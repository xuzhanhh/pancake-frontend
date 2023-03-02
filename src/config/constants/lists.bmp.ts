const PANCAKE_EXTENDED = 'https://tokens.pancakeswap.finance/pancakeswap-mini-extended.json'

export const UNSUPPORTED_LIST_URLS: string[] = []
// List of official tokens list
export const OFFICIAL_LISTS = [PANCAKE_EXTENDED]

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  PANCAKE_EXTENDED,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []
