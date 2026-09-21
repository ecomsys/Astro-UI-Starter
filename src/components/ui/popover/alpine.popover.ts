// src/alpine/popover.ts
import type { Alpine } from "alpinejs";

export default (Alpine: Alpine) => {
    Alpine.data("popover", (side = "bottom", align = "center", sideOffset = 4) => ({
        open: false,
        side: side,
        align: align,
        sideOffset: sideOffset,
        actualSide: side,
        outsideClickListener: null as any,

        init(this: any) {
            // Создаем умный слушатель кликов вне зоны
            this.outsideClickListener = (e: MouseEvent) => {
                if (!this.open) return;
                const trigger = this.$refs.trigger;
                const content = this.$refs.content;
                // Если клик не по триггеру и не по контенту — закрываем
                if (trigger && !trigger.contains(e.target) && content && !content.contains(e.target)) {
                    this.hide();
                }
            };
            document.addEventListener("click", this.outsideClickListener);
        },

        destroy(this: any) {
            // Чистим память при удалении компонента
            if (this.outsideClickListener) {
                document.removeEventListener("click", this.outsideClickListener);
            }
        },

        toggle(this: any) {
            this.open ? this.hide() : this.show();
        },

        show(this: any) {
            this.open = true;
            this.$nextTick(() => this.positionContent());
        },

        hide(this: any) {
            this.open = false;
        },

        forceHide(this: any) {
            this.open = false;
            // Мгновенное скрытие при скролле без анимации
            if (this.$refs.content) this.$refs.content.style.display = "none";
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

            if (this.side === "top" && triggerRect.top < contentHeight + offsetPx) {
                actualSide = "bottom";
            } else if (this.side === "bottom" && window.innerHeight - triggerRect.bottom < contentHeight + offsetPx) {
                actualSide = "top";
            } else if (this.side === "left" && triggerRect.left < contentWidth + offsetPx) {
                actualSide = "right";
            } else if (this.side === "right" && window.innerWidth - triggerRect.right < contentWidth + offsetPx) {
                actualSide = "left";
            }

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
            // Сбрасываем жесткое скрытие, чтобы анимация открытия сработала
            content.style.display = "";
        },
    }));
};
