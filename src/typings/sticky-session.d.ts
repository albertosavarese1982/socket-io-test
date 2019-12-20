declare module 'sticky-session'{
    import { Server } from "http";

    export function listen(
        server: Server, 
        port: number, 
        options?: {
            workers: number
        }
    ): boolean
}