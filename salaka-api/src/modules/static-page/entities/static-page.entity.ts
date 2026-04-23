import { Exclude, Expose } from "class-transformer";

export class StaticPage {
    @Expose()
    id: string;
    @Expose()
    content: string;
    @Exclude()
    key: string;
}
