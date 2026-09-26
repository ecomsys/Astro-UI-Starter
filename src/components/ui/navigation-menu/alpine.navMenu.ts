// src/alpine/navMenu.ts
import type { Alpine } from "alpinejs";

export default (Alpine: Alpine) => {
    Alpine.data("navMenu", (side = "bottom", align = "start", sideOffset = 8) => ({
        open: false,
        side: side,
        align: align,
        sideOffset: sideOffset,
        actualSide: side,
        timeout: undefined as ReturnType<typeof setTimeout> | undefined,

        outsideClickListener: null as any,
        closeNavListener: null as any,
        scrollHandler: null as any,

        // Генерируем уникальный ID для каждого экземпляра меню
        id: Math.random().toString(36).substring(2),

        init(this: any) {
            const self = this;

            this.outsideClickListener = (e: MouseEvent) => {
                if (!self.open) return;
                const trigger = self.$refs.trigger;
                const content = self.$refs.content;
                if (trigger && !trigger.contains(e.target) && content && !content.contains(e.target)) {
                    self.hide();
                }
            };
            document.addEventListener("click", this.outsideClickListener);

            this.closeNavListener = (e: any) => {
                // Если открылось другое меню, тоже закрываемся МГНОВЕННО
                if (e.detail !== self.id) self.instantHide();
            };
            window.addEventListener("close-nav-menus", this.closeNavListener);

            // Закрытие при скролле страницы
            this.scrollHandler = () => {
                if (self.open) {
                    self.instantHide(); // Мгновенно без анимаций!
                }
            };
            window.addEventListener("scroll", this.scrollHandler, { passive: true, capture: true });
        },

        destroy(this: any) {
            document.removeEventListener("click", this.outsideClickListener);
            window.removeEventListener("close-nav-menus", this.closeNavListener);
            if (this.scrollHandler) {
                window.removeEventListener("scroll", this.scrollHandler, { capture: true } as EventListenerOptions);
            }
        },

        show(this: any) {
            clearTimeout(this.timeout);

            const content = this.$refs.content;
            if (content) {
                // Сбрасываем инлайн-стили от instantHide, чтобы анимация открытия снова работала
                content.style.transition = "";
                content.style.opacity = "";
                content.style.transform = "";
            }

            window.dispatchEvent(new CustomEvent("close-nav-menus", { detail: this.id }));
            this.open = true;
            this.$nextTick(() => this.positionContent());
        },

        hide(this: any) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.open = false;
            }, 150);
        },

        // Метод для мгновенного скрытия (срубает анимацию под ноль)
        instantHide(this: any) {
            clearTimeout(this.timeout);
            const content = this.$refs.content;
            if (content) {
                content.style.transition = "none";
                content.style.opacity = "0";
                content.style.transform = "scale(0.95)";
            }
            this.open = false;
        },

        forceHide(this: any) {
            clearTimeout(this.timeout);
            this.open = false;
        },

        toggle(this: any) {
            this.open ? this.hide() : this.show();
        },

        positionContent(this: any) {
            const trigger = this.$refs.trigger;
            const content = this.$refs.content;
            if (!trigger || !content) return;

            const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const offsetPx = parseFloat(this.sideOffset) || 0;

            const triggerRect = trigger.getBoundingClientRect();
            const triggerWidth = trigger.offsetWidth;
            const triggerHeight = trigger.offsetHeight;
            const contentWidth = content.offsetWidth;
            const contentHeight = content.offsetHeight;

            let actualSide = this.side;
            if (this.side === "top" && triggerRect.top < contentHeight + offsetPx) actualSide = "bottom";
            else if (this.side === "bottom" && window.innerHeight - triggerRect.bottom < contentHeight + offsetPx)
                actualSide = "top";
            else if (this.side === "left" && triggerRect.left < contentWidth + offsetPx) actualSide = "right";
            else if (this.side === "right" && window.innerWidth - triggerRect.right < contentWidth + offsetPx)
                actualSide = "left";

            this.actualSide = actualSide;

            let topPx = 0,
                leftPx = 0;
            if (actualSide === "top") topPx = triggerRect.top - contentHeight - offsetPx;
            else if (actualSide === "bottom") topPx = triggerRect.top + triggerHeight + offsetPx;
            else if (actualSide === "left") leftPx = triggerRect.left - contentWidth - offsetPx;
            else if (actualSide === "right") leftPx = triggerRect.left + triggerWidth + offsetPx;

            if (actualSide === "top" || actualSide === "bottom") {
                if (this.align === "start") leftPx = triggerRect.left;
                else if (this.align === "center") leftPx = triggerRect.left + triggerWidth / 2 - contentWidth / 2;
                else if (this.align === "end") leftPx = triggerRect.right - contentWidth;
            } else {
                if (this.align === "start") topPx = triggerRect.top;
                else if (this.align === "center") topPx = triggerRect.top + triggerHeight / 2 - contentHeight / 2;
                else if (this.align === "end") topPx = triggerRect.bottom - contentHeight;
            }

            content.style.top = topPx / remInPx + "rem";
            content.style.left = leftPx / remInPx + "rem";
            content.style.visibility = "visible";
        },
    }));
};
