// Файл подключения больших Альпин скриптов для компонентов
import type { Alpine } from "alpinejs";
import collapse from "@alpinejs/collapse";

import tooltip from "./components/ui/tooltip/alpine.tooltip";
import dropdown from "./components/ui/dropdown-menu/alpine.dropdown";
import scrollArea from "./components/ui/scroll-area/alpine.scrollArea";
import hoverCard from "./components/ui/hover-card/alpine.hoverCard";
import popover from "./components/ui/popover/alpine.popover";
import contextMenu from "./components/ui/context-menu/alpine.contextMenu";
import select from "./components/ui/select/alpine.select";
import toaster from "./components/ui/sonner/alpine.toaster";

export default (Alpine: Alpine) => {
    Alpine.plugin(collapse);

    tooltip(Alpine);
    dropdown(Alpine);
    scrollArea(Alpine);
    hoverCard(Alpine);
    popover(Alpine);
    contextMenu(Alpine);
    select(Alpine);
    toaster(Alpine);

    // функция глобального управления скролом и оверлеем
    Alpine.data("overlay", () => ({
        open: false,
        scrollbarWidth: 0,
        closeTimeout: undefined as ReturnType<typeof setTimeout> | undefined,

        init(this: any) {
            this.scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        },

        toggleScrollLock(this: any) {
            clearTimeout(this.closeTimeout);

            if (this.open) {
                document.body.style.overflow = "hidden";
                document.body.style.paddingRight = `${this.scrollbarWidth}px`;
            } else {
                this.closeTimeout = setTimeout(() => {
                    document.body.style.overflow = "";
                    document.body.style.paddingRight = "";
                }, 75);
            }
        },
    }));
};
