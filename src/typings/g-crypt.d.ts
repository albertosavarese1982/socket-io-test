declare module 'g-crypt'{
    export default crypter

    function crypter(passphrase: string): Crypt

    export interface Crypt{
        decrypt(data: any) : any; 
        encrypt(data: any) : any;
    }
}

