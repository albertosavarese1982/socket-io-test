import cryptFactory, {Crypt} from 'g-crypt';

let crypter: Crypt;

if (process.env.CRYPTO_KEY) {
    crypter = cryptFactory(process.env.CRYPTO_KEY);
} else {
    console.log('Misiing crypter KEY');
    crypter = cryptFactory('temporary');
}

export default crypter;