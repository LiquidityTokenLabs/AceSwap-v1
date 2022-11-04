export const Color = {
  white: {
    primary: '#F7F8FA',
    seccondary: '#EDEEF2',
    pure: '#FFFFFF',
  },
  black: {
    primary: '#0F111A',
    secondary: '#D9D9D9',
    pure: '#000000',
  },
  text: {
    primary: '#0F111A',
    secondary: '#8E8E8E',
  },
  themes: {
    primary: {
      default: '#80A6D5',
      light: '',
      dark: '#295293',
    },
    secondary: {
      default: '#FAEBF1',
    },
  },
  status: {
    disabled: '#E0E0E0',
    error: '#C93E35',
    worning: '#',
    success: '#2E7D32',
  },
}

export interface ColorPallet {
  text?: string
  background?: string
  bordar?: string
}
