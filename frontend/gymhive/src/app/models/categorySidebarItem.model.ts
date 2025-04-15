export interface SidebarItem {
    name: string;
    link: string;
    subcategories: string[];
    featured?: { title: string; image: string; link: string }[];
    popularProducts?: { name: string; image: string; price: number; link: string }[];
}