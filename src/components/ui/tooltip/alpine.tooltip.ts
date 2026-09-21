// src/alpine/tooltip.ts
import type { Alpine } from "alpinejs";

export default (Alpine: Alpine) => {
    // Принимаем sideOffset в пикселях (например, 4)
    Alpine.data("tooltip", (delay = 100, side = "top", sideOffset = 4) => ({
        visible: false,
        delay: delay,
        side: side,
        sideOffset: sideOffset,
        actualSide: side,
        timeout: undefined as ReturnType<typeof setTimeout> | undefined,

        show(this: any) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.visible = true;
                this.$nextTick(() => this.positionTooltip());
            }, this.delay);
        },

        hide(this: any, instant = false) {
            clearTimeout(this.timeout);
            if (instant) {
                this.visible = false;
            } else {
                this.timeout = setTimeout(() => (this.visible = false), 50);
            }
        },

        forceHide(this: any) {
            this.visible = false;
            // Мгновенное скрытие при скролле без анимации
            if (this.$refs.tooltip) this.$refs.tooltip.style.display = "none";
        },

        positionTooltip(this: any) {
            const trigger = this.$refs.trigger;
            const tooltip = this.$refs.tooltip;
            if (!trigger || !tooltip) return;

            // Узнаем, сколько пикселей в 1rem (обычно 16)
            const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);

            // sideOffset у нас в пикселях, так что просто используем его
            const offsetPx = this.sideOffset;

            const triggerRect = trigger.getBoundingClientRect();
            const triggerWidth = trigger.offsetWidth;
            const triggerHeight = trigger.offsetHeight;
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;

            let actualSide = this.side;

            // Логика переворота (работаем в пикселях)
            if (this.side === "top" && triggerRect.top < tooltipHeight + offsetPx) {
                actualSide = "bottom";
            } else if (this.side === "bottom" && window.innerHeight - triggerRect.bottom < tooltipHeight + offsetPx) {
                actualSide = "top";
            } else if (this.side === "left" && triggerRect.left < tooltipWidth + offsetPx) {
                actualSide = "right";
            } else if (this.side === "right" && window.innerWidth - triggerRect.right < tooltipWidth + offsetPx) {
                actualSide = "left";
            }

            this.actualSide = actualSide;

            let topPx = 0,
                leftPx = 0;
            if (actualSide === "top") {
                topPx = triggerRect.top - tooltipHeight - offsetPx;
                leftPx = triggerRect.left + triggerWidth / 2 - tooltipWidth / 2;
            } else if (actualSide === "bottom") {
                topPx = triggerRect.top + triggerHeight + offsetPx;
                leftPx = triggerRect.left + triggerWidth / 2 - tooltipWidth / 2;
            } else if (actualSide === "left") {
                topPx = triggerRect.top + triggerHeight / 2 - tooltipHeight / 2;
                leftPx = triggerRect.left - tooltipWidth - offsetPx;
            } else if (actualSide === "right") {
                topPx = triggerRect.top + triggerHeight / 2 - tooltipHeight / 2;
                leftPx = triggerRect.left + triggerWidth + offsetPx;
            }

            // МАГИЯ: Переводим финальные пиксели обратно в REM!
            // 4px превратятся в 0.25rem (при шрифте 16px)
            tooltip.style.top = topPx / remInPx + "rem";
            tooltip.style.left = leftPx / remInPx + "rem";
        },
    }));
};
