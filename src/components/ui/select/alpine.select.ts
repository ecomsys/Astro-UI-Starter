// src/alpine/select.ts
import type { Alpine } from "alpinejs";

export default (Alpine: Alpine) => {
    Alpine.data("select", (defaultValue = "", defaultLabel = "", side = "bottom", align = "start", sideOffset = 4) => ({
        open: false,
        selectedValue: defaultValue,
        selectedLabel: defaultLabel,
        side: side,
        align: align,
        sideOffset: sideOffset,
        actualSide: side,
        outsideClickListener: null as any,

        init(this: any) {
            this.outsideClickListener = (e: MouseEvent) => {
                if (!this.open) return;
                const trigger = this.$refs.trigger;
                const content = this.$refs.content;
                if (trigger && !trigger.contains(e.target) && content && !content.contains(e.target)) {
                    this.hide();
                }
            };
            document.addEventListener("click", this.outsideClickListener);
        },

        destroy(this: any) {
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

        // Новый метод: мгновенно скрывает без поломки анимаций Alpine
        instantHide(this: any) {
            this.open = false;
            const content = this.$refs.content;
            if (content) {
                content.style.transition = "none";
                content.style.opacity = "0";
                content.style.transform = "scale(0.95)";
            }
        },

        select(this: any, value: string, label: string) {
            this.selectedValue = value;
            this.selectedLabel = label;
            this.hide();

            // МАГИЯ: Стреляем от кнопки-триггера!
            // Она не телепортируется, значит событие 100% всплывёт к родителю локально.
            if (this.$refs.trigger) {
                this.$refs.trigger.dispatchEvent(
                    new CustomEvent("select-change", {
                        detail: value,
                        bubbles: true,
                        composed: true,
                    }),
                );
            }
        },

        positionContent(this: any) {
            const trigger = this.$refs.trigger;
            const content = this.$refs.content;
            if (!trigger || !content) return;

            // Сбрасываем инлайн-стили от instantHide, чтобы анимация открытия снова работала
            content.style.transition = "";
            content.style.opacity = "";
            content.style.transform = "";

            const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const offsetPx = parseFloat(this.sideOffset) || 0;

            const triggerRect = trigger.getBoundingClientRect();
            const triggerWidth = trigger.offsetWidth;
            const triggerHeight = trigger.offsetHeight;
            const contentWidth = content.offsetWidth;
            const contentHeight = content.offsetHeight;

            content.style.width = triggerWidth / remInPx + "rem";

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
        },
    }));
};
