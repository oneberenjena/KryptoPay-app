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

/* 
 * OPERATIONS AND TRANSACTIONS DATA MODELS
 *
 */
export class DailyBalance {
    date: Date;
    totalBs: number;
    balance: OperationsHistoric;

    constructor(date: Date = new Date()) {
        this.date = date;
    }
}

export class WeeklyBalance {
    weeklyTotalBs: number;
    weekStart: Date;
    weekEnd: Date;
    balance: Array<DailyBalance>;

    constructor(date: Date = new Date()) {
        this.weekStart = getWeekFirstDate(date);
        this.weekEnd = getWeekLastDate(date);
    }
}

export class MonthlyBalance {
    monthlyTotalBs: number;
    monthStart: Date;
    monthEnd: Date;
    balance: Array<WeeklyBalance>;

    constructor(date: Date = new Date()) {
        this.monthStart = getMonthFirstDate(date);
        this.monthEnd = getMonthLastDate(date);
    }
}

export class YearlyBalance {
    yearlyTotalBs: number;
    yearStart: Date;
    yearEnd: Date;
    balance: Array<MonthlyBalance>;
}

function getWeekFirstDate(date: Date = new Date()) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay() + 1
    );
}

function getWeekLastDate(date: Date = new Date()) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay() + 7
    );
}

function getMonthFirstDate(date: Date = new Date()) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    );
}

function getMonthLastDate(date: Date = new Date()) {
    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    );
}

export class Operation {
    private _id: string;
    private _refNum: number;
    public cryptoUsed: CryptoCurrency;
    public amountBs: number;
    public amountCrypto: number;
    public date: Date;
    public cashier: Cashier;

    public constructor(
        crypto: CryptoCurrency,
        amountBs: number,
        amountCrypto: number,
        refNum: number
    ) {
        this.cryptoUsed = crypto;
        this.amountBs = amountBs;
        this.amountCrypto = amountCrypto;
        this.date = new Date();
        this._refNum = refNum;
    }

    get id(): string {
        return this._id;
    }

    get refNum(): number {
        return this._refNum;
    }

    set setRefNum(ref: number) {
        this._refNum = ref;
    }

    set modifyAmountBs(amountBs: number) {
        this.amountBs = amountBs;
        this.amountCrypto = this.amountBs / this.cryptoUsed.value;
    }

    set modifyAmountCrypto(amountCrypto: number) {
        this.amountCrypto = amountCrypto;
        this.amountBs = this.amountCrypto * this.cryptoUsed.value;
    }

    set modifyDate(date: Date) {
        this.date = new Date(date);
    }

    public getDateAsArray(): Array<number> {
        return [this.date.getDate(), this.date.getMonth(), this.date.getFullYear()];
    }

    public getCashier(): Cashier {
        return this.cashier;
    }
}

export class OperationsHistoric {
    public operations: Array<Operation>;

    public constructor() {
        this.operations = [];
    }

    public getOperationById(id: string): any {
        this.operations.forEach(operation => {
            if (operation.id === id) return operation;
        });

        return null;
    }

    public getOperationByRefNum(ref: number): any {
        this.operations.forEach(operation => {
            if (operation.refNum === ref) return operation;
        });

        return null;
    }

    public storeOperation(operation: Operation) {
        this.operations.push(operation);
    }

    public removeOperation(operationRefNum: number): any {
        let operation: Operation = this.getOperationByRefNum(operationRefNum);
        let index: number = this.operations.indexOf(operation);

        if (index > -1) {
            this.operations = this.operations.splice(index, 1);
        } else {
            return Error("No se ha encontrado la operación con número de referencia " + operationRefNum + ".");
        }
    }

    public getDailyBalance(date: Date = new Date()): DailyBalance {
        let day: number = date.getDate();
        let month: number = date.getMonth() + 1;
        let year: number = date.getFullYear();
        let totalBs: number = .0;
        let balance: OperationsHistoric = new OperationsHistoric();

        this.operations.forEach(operation => {
            let [opDay, opMonth, opYear] = operation.getDateAsArray();

            if (opYear === year && opMonth === month && opDay === day) {
                balance.storeOperation(operation);
                totalBs += operation.amountBs;
            }
        });

        return { date, totalBs, balance };
    }

    public getWeeklyBalance(date: Date = new Date()): WeeklyBalance {
        let weekBalance: WeeklyBalance;
        let weekStartDate = getWeekFirstDate(date);

        weekBalance.balance = [];
        weekBalance.weekStart = weekStartDate;
        weekBalance.weekEnd = getWeekLastDate(date);

        let day: Date = weekStartDate;
        let tempDailyBalance: DailyBalance;

        while (day >= date) {
            tempDailyBalance = this.getDailyBalance(new Date(weekStartDate.setDate(day.getDate())));
            weekBalance.weeklyTotalBs += tempDailyBalance.totalBs;
            weekBalance.balance.push(tempDailyBalance);
            day.setDate(day.getDate() + 1);
        }

        return weekBalance;
    }

    public getMonthlyBalance(date: Date = new Date()) {
        let monthlyBalance: MonthlyBalance;
        let monthStartDate: Date = getMonthFirstDate();

        monthlyBalance.balance = [];
        monthlyBalance.monthStart = monthStartDate;
        monthlyBalance.monthEnd = getMonthLastDate();

        let day: Date = monthStartDate;
        let tempWeeklyBalance: WeeklyBalance;

        while (day >= date) {
            tempWeeklyBalance = this.getWeeklyBalance(new Date(monthStartDate.setDate(day.getDate())));
            monthlyBalance.monthlyTotalBs += tempWeeklyBalance.weeklyTotalBs;
            monthlyBalance.balance.push(tempWeeklyBalance);
            day.setDate(day.getDate() + 7);
        }

        return monthlyBalance;
    }
}

/* 
 * USERS AND ROLES DATA MODELS
 *
 */
export abstract class User {
    private _id: string;
    public name: string;
    public lastname: string;
    public email: string;
    public role: string;
    public availableCurrencies: CryptoList;
    public balance: OperationsHistoric;

    public constructor(
        name: string,
        lastname: string,
        email: string,
        role: string
    ) {
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.role = role;
    }

    public id(): string {
        return this._id;
    }

    public currencies(): CryptoList {
        return this.availableCurrencies;
    }

    public abstract getDailyBalance(date: Date): DailyBalance;

    public abstract getWeeklyBalance(date: Date): WeeklyBalance;

    public abstract getMonthlyBalance(date: Date): MonthlyBalance;
}

export class Cashier extends User {
    private cashierId: string;
    public numOperations: number;

    public constructor(name: string, lastname: string, email: string) {
        super(name, lastname, email, "Cashier");
        this.numOperations = 0;
    }

    public createOperation(crypto: CryptoCurrency, amountBs: number, amountCrypto: number, refNum: number) {
        let newOperation: Operation = new Operation(crypto, amountBs, amountCrypto, refNum);
        this.balance.storeOperation(newOperation);
        this.numOperations++;
    }

    public getDailyBalance(date: Date = new Date()): DailyBalance {
        return this.balance.getDailyBalance(date);
    }

    public getWeeklyBalance(date: Date = new Date()): WeeklyBalance {
        return this.balance.getWeeklyBalance(date);
    }

    public getMonthlyBalance(date: Date = new Date()): MonthlyBalance {
        return this.balance.getMonthlyBalance(date);
    }

}

export class Admin extends User {
    private _cashierList: Array<Cashier>;

    public constructor(name: string, lastname: string, email: string) {
        super(name, lastname, email, "Admin");
        this._cashierList = [];
    }

    get getCashiers(): Array<Cashier> {
        return this._cashierList;
    }

    public getCashierById(cashierId: string): Cashier {
        return this._cashierList.find(cashier => {
            return cashier.id() === cashierId;
        });
    }

    public addCashier(cashier: Cashier) {
        this._cashierList.push(cashier);
    }

    public removeCashier(cashierId: string): any {

        let cashierToRemove: Cashier = this.getCashierById(cashierId);

        if (!cashierToRemove) {
            return Error("No se pudo eliminar al cajero con id: " + cashierId + ". No se encuentra en la lista de sus cajeros.");
        }

        let index: number = this._cashierList.indexOf(cashierToRemove);

        if (index > -1) {
            this._cashierList = this._cashierList.splice(index, 1);
        } else {
            return Error("Ocurrió un error. No se pudo eliminar al cajero con id: " + cashierId + ".");
        }
    }

    public addCurrency(crypto: CryptoCurrency) {
        this.availableCurrencies.addCrypto(crypto);
    }

    public removeCurrency(cryptoName: string) {
        this.availableCurrencies.removeCrypto(cryptoName);
    }

    /**
     * getDailyBalance
     * 
     * Returns daily balance from all cashiers
     */
    public getDailyBalance(date: Date = new Date()): DailyBalance {
        let dailyBalance: DailyBalance = new DailyBalance(date);
        let cashierDailyBalance: DailyBalance;

        this._cashierList.forEach(cashier => {
            cashierDailyBalance = cashier.getDailyBalance(date);
            dailyBalance.totalBs += cashierDailyBalance.totalBs;

            cashierDailyBalance.balance.operations.forEach(operation => {
                dailyBalance.balance.operations.push(operation);
            });
        });

        return dailyBalance;
    }

    /**
     * getDailyBalanceFromCashier
     */
    public getDailyBalanceFromCashier(cashierId: string, date: Date = new Date()): any {
        let cashier: Cashier = this.getCashierById(cashierId);

        if (!cashier) {
            return Error("No se pudo obtener el balance del cajero con id: " + cashierId + ". No se encuentra en la lista de sus cajeros.");
        }

        return cashier.getDailyBalance(date);
    }

    /**
     * getWeeklyBalance
     */
    public getWeeklyBalance(date: Date = new Date()): WeeklyBalance {
        let weeklyBalance: WeeklyBalance = new WeeklyBalance(date);
        let cashierWeeklyBalance: WeeklyBalance;

        this._cashierList.forEach(cashier => {
            cashierWeeklyBalance = cashier.getWeeklyBalance();
            weeklyBalance.weeklyTotalBs += cashierWeeklyBalance.weeklyTotalBs;

            cashierWeeklyBalance.balance.forEach(dailyBalance => {
                weeklyBalance.balance.push(dailyBalance);
            });
        });

        return weeklyBalance;
    }

    /**
     * getWeeklyBalanceFromCashier
     */
    public getWeeklyBalanceFromCashier(cashierId: string, date: Date = new Date()): any {
        let cashier: Cashier = this.getCashierById(cashierId);
        if (!cashier) {
            return Error("No se pudo obtener el balance del cajero con id: " + cashierId + ". No se encuentra en la lista de sus cajeros.");
        }

        return cashier.getWeeklyBalance(date);

    }


    /**
     * getMonthlyBalance
     */
    public getMonthlyBalance(date: Date = new Date()) {
        let monthlyBalance: MonthlyBalance = new MonthlyBalance(date);
        let cashierMonthlyBalance: MonthlyBalance;

        this._cashierList.forEach(cashier => {
            cashierMonthlyBalance = cashier.getMonthlyBalance(date);
            monthlyBalance.monthlyTotalBs += cashierMonthlyBalance.monthlyTotalBs;

            cashierMonthlyBalance.balance.forEach(dailyBalance => {
                monthlyBalance.balance.push(dailyBalance);
            });
        });

        return monthlyBalance;
    }

    /**
     * getMonthlyBalanceFromCashier
     */
    public getMonthlyBalanceFromCashier(cashierId: string, date: Date = new Date()) {
        let cashier: Cashier = this.getCashierById(cashierId);
        if (!cashier) {
            return Error("No se pudo obtener el balance del cajero con id: " + cashierId + ". No se encuentra en la lista de sus cajeros.");
        }

        return cashier.getMonthlyBalance(date);
    }

}