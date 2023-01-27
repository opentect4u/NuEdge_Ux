import { submenu } from "./submenu";

export interface menuBodyList {
    id: number;
    icon: string;
    title: string;
    img: string;
    value: number;
    url: string;
    class: string;
    sub_menu?:submenu[];

}