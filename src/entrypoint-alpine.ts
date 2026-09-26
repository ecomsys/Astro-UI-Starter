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
import slider from "./components/ui/slider/alpine.slider";
import carousel from "./components/ui/carousel/alpine.carousel";
import resizible from "./components/ui/resizible/alpine.resizible";
import navMenu from "./components/ui/navigation-menu/alpine.navMenu";
import sidebar from "./components/ui/sidebar/alpine.sidebar";
import menubar from "./components/ui/menubar/alpine.menubar";
import command from "./components/ui/command/alpine.command";
import inputOTP from "./components/ui/input-otp/alpine.inputOTP";
import calendar from "./components/ui/calendar/alpine.calendar";

import barChart from "./components/ui/chart/alpine.barChart";
import donutChart from "./components/ui/chart/alpine.donutChart";
import lineChart from "./components/ui/chart/alpine.lineChart";

import wysiwygEditor from "./components/ui/wysiwyg-editor/alpine.wysiwyg-editor";

export default (Alpine: Alpine) => {
    Alpine.plugin(collapse);

    // компоненты
    tooltip(Alpine);
    dropdown(Alpine);
    scrollArea(Alpine);
    hoverCard(Alpine);
    popover(Alpine);
    contextMenu(Alpine);
    select(Alpine);
    toaster(Alpine);
    slider(Alpine);
    carousel(Alpine);
    resizible(Alpine);
    navMenu(Alpine);
    sidebar(Alpine);
    menubar(Alpine);
    command(Alpine);
    inputOTP(Alpine);
    calendar(Alpine);

    // графики
    barChart(Alpine);
    donutChart(Alpine);
    lineChart(Alpine);

    // редактор
    wysiwygEditor(Alpine);

    // функция глобального управления скролом и оверлеем через альпину
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
