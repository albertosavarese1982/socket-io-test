declare module 'memored'{
    export function store(
        key: string,
        value: any,
        callback?: () => void
    ): void

    export function read(
        key: string,
        callback: (err: Error, value: any) => void
    ): void
}