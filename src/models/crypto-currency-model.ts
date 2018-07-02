/* 
 * CRYPTO CURRENCIES DATA MODELS
 *
 */
export class CryptoCurrency {
    public name: string;
    public value: number;

    public updateValue(val: number) {
        this.value = val;
    }
}

export class CryptoList {
    public cryptos: Array<CryptoCurrency>;

    public constructor(cryptos?: Array<CryptoCurrency>) {
        this.cryptos = cryptos || [];
    }

    public getCrypto(name: string): any {
        this.cryptos.find(crypto => {
            return crypto.name === name;
        });
    }

    public updateCryptoValue(crypto: string, val: number) {
        let selectedCrypto: CryptoCurrency = this.getCrypto(crypto);
        if (!selectedCrypto) {
            return Error("Usted no ha registrado la moneda " + crypto + ".");
        } else {
            selectedCrypto.updateValue(val);
        }
    }

    public addCrypto(crypto: CryptoCurrency): any {
        if (!this.getCrypto(crypto.name)) {
            this.cryptos.push(crypto);
        } else {
            return Error(crypto.name + " ya existe en su lista monedas disponibles.");
        }
    }

    public removeCrypto(crypto: string): any {
        let selectedCrypto: any = this.getCrypto(crypto);
        if (!selectedCrypto) {
            return Error("Usted no ha registrado la moneda " + crypto + ".");
        } else {
            let index: number = this.cryptos.indexOf(selectedCrypto);
            if (index > -1) {
                this.cryptos = this.cryptos.splice(index, 1);
            } else {
                return Error("Error al eliminar la moneda " + crypto + ".");
            }
        }
    }
}