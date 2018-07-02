import { CryptoCurrency, CryptoList } from './crypto-currency-model';
import { OperationsHistoric, Operation, DailyBalance, WeeklyBalance, MonthlyBalance } from './operations-model';
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
    public getMonthlyBalanceFromCashier(cashierId:string, date:Date = new Date()) {
        let cashier: Cashier = this.getCashierById(cashierId);
        if (!cashier) {
            return Error("No se pudo obtener el balance del cajero con id: " + cashierId + ". No se encuentra en la lista de sus cajeros.");
        }

        return cashier.getMonthlyBalance(date);
    }

}