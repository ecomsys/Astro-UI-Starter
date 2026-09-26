// src/alpine/menubar.ts
import type { Alpine } from "alpinejs";

export default (Alpine: Alpine) => {
    Alpine.store("menubar", {
        active: false,
        closeAll() {
            window.dispatchEvent(new CustomEvent("menubar-close-all"));
        },
    });

    Alpine.data("menubarMenu", (side = "bottom", align = "start", sideOffset = 4) => ({
        open: false,
        side,
        align,
        sideOffset,
        actualSide: side,
        outsideClickListener: null as any,

        init(this: any) {
            this.outsideClickListener = (e: MouseEvent) => {
                if (!this.open) return;
                const trigger = this.$refs.trigger;
                const content = this.$refs.content;
                if (trigger && !trigger.contains(e.target) && content && !content.contains(e.target)) {
                    this.forceHide();
                    (Alpine.store("menubar") as any).active = false; // Сброс режима только при клике ВНЕ зоны
                }
            };
            document.addEventListener("click", this.outsideClickListener);
            window.addEventListener("menubar-close-all", () => this.forceHide());
        },

        destroy(this: any) {
            document.removeEventListener("click", this.outsideClickListener);
        },

        toggle(this: any) {
            if (this.open) {
                this.forceHide();
                (Alpine.store("menubar") as any).active = false;
            } else {
                (Alpine.store("menubar") as any).closeAll();
                (Alpine.store("menubar") as any).active = true;
                this.open = true;
                this.$nextTick(() => this.positionContent());
            }
        },

        hoverOpen(this: any) {
            if ((Alpine.store("menubar") as any).active && !this.open) {
                (Alpine.store("menubar") as any).closeAll();
                this.open = true;
                this.$nextTick(() => this.positionContent());
            }
        },

        // ВОЗВРАЩАЕМ ЧИСТЫЙ forceHide! Он больше не трогает active.
        forceHide(this: any) {
            this.open = false;
            if (this.$refs.content) this.$refs.content.style.display = "none";
        },

        // НОВЫЙ МЕТОД: Для глобальных событий (скролл/ресайз)
        globalHide(this: any) {
            this.forceHide();
            (Alpine.store("menubar") as any).active = false;
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
