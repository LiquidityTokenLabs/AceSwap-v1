import { Color, ColorPallet } from '@liqlab/utils/Color'

export interface ButtonColor {
  fontColor: string
  backgroundColor: string
  borderColor: string
}

export const MainButtonColorPallet: ColorPallet = {
  text: Color.white.pure,
  background: Color.themes.primary.default,
}
export const MainButtonHoverColorPallet: ColorPallet = {
  text: Color.white.pure,
  background: Color.themes.primary.dark,
}
