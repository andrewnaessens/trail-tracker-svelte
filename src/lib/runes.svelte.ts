import type { Category, Trail } from "./types/trail-tracker-types";

export const subTitle = $state({ text: "" });
export const loggedInUser = $state({ 
    email: "",
    name: "",
    token: "",
    userid: ""
 });
export const currentCategories = $state({ categories: [] as Category[] });
export const currentTrails = $state({ trails: [] as Trail[] });
export const currentTrail = $state({ trail: {} as Trail });
