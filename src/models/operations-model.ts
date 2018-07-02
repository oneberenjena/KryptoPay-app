import { CryptoCurrency } from './crypto-currency-model';
import { Cashier } from './users-model';

/* 
 * OPERATIONS AND TRANSACTIONS DATA MODELS
 *
 */
export class DailyBalance {
    date: Date;
    totalBs: number;
    balance: OperationsHistoric;

    constructor(date:Date = new Date()){
        this.date = date;
    }
}

export class WeeklyBalance {
    weeklyTotalBs: number;
    weekStart: Date;
    weekEnd: Date;
    balance: Array<DailyBalance>;

    constructor(date:Date = new Date()){
        this.weekStart = getWeekFirstDate(date);
        this.weekEnd = getWeekLastDate(date);
    }
}

export class MonthlyBalance {
    monthlyTotalBs: number;
    monthStart: Date;
    monthEnd: Date;
    balance: Array<WeeklyBalance>;

    constructor(date:Date = new Date()){
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

    public getCashier():Cashier{
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

