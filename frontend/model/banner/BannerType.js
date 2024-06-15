import BannerSize from "./BannerSize"

export default class BannerType {
    constructor(name, displayName, availableSizes) {
        this.name = name
        this.displayName = displayName
        this.availableSizes = availableSizes
    }
}

export const bannerTypes = [
    new BannerType("square", "Квадратный баннер", [
        new BannerSize("sqb_top", "Сверху"),
        new BannerSize("sqb_bottom", "Снизу"),
    ]),
    new BannerType("ghost_banner_small", "Промо-баннер маленький", [
        new BannerSize("gb_start", "Слева"),
        new BannerSize("gb_end", "Справа"),
    ]),
    new BannerType("ghost_banner_medium", "Промо-баннер средний", [
        new BannerSize("gb_start", "Слева"),
        new BannerSize("gb_end", "Справа"),
    ]),
    new BannerType("nbo_banner", "Баннер NBO", [
        new BannerSize("nbob_top_start", "Сверху слева"),
        new BannerSize("nbob_top_end", "Сверху справа"),
        new BannerSize("nbob_bottom_start", "Снизу слева"),
        new BannerSize("nbob_bottom_end", "Снизу справа"),
    ]),
    new BannerType("rectangle_mb", "Прямоугольный баннер МБ", [
        new BannerSize("ptb_bottom", "Снизу"),
        new BannerSize("ptb_top", "Сверху"),
    ]),
    new BannerType("part_transparent", "Частично-прозрачный баннер МБ", [
        new BannerSize("ptb_bottom", "Снизу"),
        new BannerSize("ptb_top", "Сверху"),
    ])
]