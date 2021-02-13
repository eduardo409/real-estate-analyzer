var moment = require('moment');
class ScheduleDTO {
    constructor(i, a, inte, p, b, ti) {
        this.index = i;
        this.payment = a;
        this.interest = inte;
        this.principle = p;
        this.balance = b;
        this.totalInterest = ti;
    }

}

class Asset {
    constructor(n, nc, s, v) {
        this.name;
        this.squareFt;
        this.value;
        this.costToMakeRentReady;

        this.setName(n);
        this.setSquareFt(s);
        this.setValue(v);
        this.setCostToMakeRentReady(nc);
    }

    setName(value) { this.name = value };
    setSquareFt(value) { this.squareFt = parseFloat(value) };
    setValue(value) { this.value = parseFloat(value) };
    setCostToMakeRentReady(value) { this.costToMakeRentReady = parseFloat(value) };

    getName() { return this.name };
    getSquareFt() { return this.squareFt };
    getValue() { return this.value }
    getCostToMakeRentReady() { return this.costToMakeRentReady }

}
class Loan {
    constructor(p, r, t) {
        this._initialPrincipal;
        this._interestRate;
        this._termInYears;
        // date of first payment
        this._firstPayment;

        this.setInitialPrincipal(p);
        this.setInterestRate(r);
        this.setTermInYears(t)
    }
    getInitialPrincipal() { return this._initialPrincipal };
    getInterestRate() { return this._interestRate };
    getTermInYears() { return this._termInYears };
    getFirstPayment() { return this._firstPayment };
    getPaymentFrequency() { return this._paymentFrequency };

    setInitialPrincipal(value) { this._initialPrincipal = parseFloat(value) };
    setInterestRate(value) { this._interestRate = parseFloat(value) / 100 };
    setTermInYears(value) { this._termInYears = parseInt(value) };
    setfirstPayment(value) { this._firstPayment = moment(value) }
    setPaymentFrequency(value) { this._paymentFrequency = value }

    // Amortization formula can be found here: https://www.vertex42.com/ExcelArticles/amortization-calculation.html
    calTotalNumberOfPayments() { return this._termInYears * 12; }
    calRatePerPeriod() { return this._interestRate / 12; }
    calPaymentAmountPerPeriod() {
        let r = this.calRatePerPeriod()
        let n = this.calTotalNumberOfPayments()
        let pow = Math.pow(1 + r, n)
        return this._initialPrincipal * (r * pow) / (pow - 1);
    }

    calSchedule() {
        let numberOfPayments = this.calTotalNumberOfPayments();
        let paymentAmountPerPeriod = this.calPaymentAmountPerPeriod();
        let ratePerPeriod = this.calRatePerPeriod()
        let schedule = [];
        var balance = this._initialPrincipal;
        var totalInterest = 0
        for (let i = 0; i < numberOfPayments; i++) {
            let interest = balance * ratePerPeriod;
            let principle = paymentAmountPerPeriod - interest
            balance = balance - principle;
            totalInterest = totalInterest + interest;
            let dto = new ScheduleDTO(i, paymentAmountPerPeriod.toFixed(3), interest.toFixed(3), principle.toFixed(3), balance.toFixed(3), totalInterest.toFixed(3));
            schedule.push(dto);

        }

        return schedule;

    }
}

class Variable {
    constructor(down, income, expense, vacancy, closingCost) {
        this.percentDown = down;
        this.percentClosingCost = closingCost;
        this.income = income;
        this.expenses = expense;
        this.vacancy = vacancy;

        this.setPercentDown(down);
        this.setPercentClosingCost(closingCost);
        this.setIncome(income);
        this.setExpense(expense);
        this.setVacancy(vacancy)
    }
    getPercentDown() { return this.percentDown };
    getPercentClosingCost() { return this.percentClosingCost }
    getIncome() { return this.income };
    getExpense() { return this.expense };
    getVacancy() { return this.vacancy };

    setPercentDown(value) { this.percentDown = parseFloat(value) / 100 };
    setPercentClosingCost(value) { this.percentClosingCost = parseFloat(value) / 100 };
    setIncome(value) { this.income = parseFloat(value) };
    setExpense(value) { this.expense = parseFloat(value) };
    setVacancy(value) { this.vacancy = parseFloat(value) };


}
// downpayment, asset, loan, income expenses vacancy
class Analyser {
    constructor(asset, loan, variable) {
        this.asset = asset;
        this.loan = loan;
        this.variable = variable
    }

    getAsset() { return this.asset };
    getLoan() { return this.loan };
    getVariable() { return this.variable}


    setLoan(value) { this.loan = value };
    setAsset(value) { this.asset = value };
    setVariable(value){this.variable = value}


    // downpayment value: downPercentage * assetValue
    calculateDownPayment() { return this.getVariable().getPercentDown() * this.getAsset().getValue() }
    // calculate leverage: asset valule - downpayment 
    calculateLeverage() { return this.getAsset().getValue() - this.calculateDownPayment() }
    // closing cost value
    calculateClosingCost() { return this.getVariable().getPercentClosingCost() * this.calculateLeverage() }
    // calculate total capital required 
    calculateTotalCapitalRequired() {
        return this.getAsset().getCostToMakeRentReady() + this.calculateDownPayment() + this.calculateClosingCost()
    }
    //Calculatees Effective Gross income: potential income - vacancy
    calculateEGI() { return this.getVariable().getIncome() - this.getVariable().getVacancy() };
    // Calculate Net Operating Income: EffectiveGrossincome - expenses
    calculateNOI() { return this.calculateEGI() - this.getVariable().getExpense() };
    // rounded up yearly debt service:  PaymentAmountPerPeriod * 12
    calculateDebtService() { return Math.ceil(this.getLoan().calPaymentAmountPerPeriod() * 12) }
    // calculate cashflow
    calculateCashFlow() { return this.calculateNOI() - this.calculateDebtService() }
    // calculate cash on cash percentage: TotalCapitalRequired / CashFlow
    calculateCashOnCash() { return parseFloat((this.calculateCashFlow() / this.calculateTotalCapitalRequired()).toFixed(3)) }
    /**
     * returns list of acumulated principle paydown per year
     * 30 year term = list of size 30 
     * element [0] = year 1 principle paydown
     */
    calculatePrinciplePaydown() {
        let schedule = this.getLoan().calSchedule().map(period => parseFloat(period.principle));
        let paydown = [];
        let sum = 0;
        let counter = 0;
        for (let i = 0; i < this.getLoan().calSchedule().length; i++) {
            sum = sum + schedule[i]
            counter++
            if (counter == 12) {
                paydown.push(parseFloat(sum.toFixed(2)))
                sum = 0;
                counter = 0;
            }
        }
        return paydown
    }
    /**
     * returns list of acumulated equity per year
     * 30 year term = list of size 30 
     * element [0] = downpayment + principle payed down for year 1 
     * element [29] = downpayment + principle payed down for year 30, this should equate to home value (not accounting appreciation)
     * TODO add calculation that account apreciation  
     */
    calculateNonApreciatedEquity() {
        let yearlyPrinciplePaydown = this.calculatePrinciplePaydown()
        let downpayment = this.calculateDownPayment();
        let equity = []
        for (let i = 1; i <= yearlyPrinciplePaydown.length; i++) {
            let array = yearlyPrinciplePaydown
            let sum = array.slice(0, i).reduce((a, b) => a + b, 0) + downpayment;
            equity.push(Math.floor(sum))
        }
        return equity
    }
    // calculate caprate
    /**
     * 
     * 
     * 
     */
}

exports.Loan = Loan;
exports.Asset = Asset;
exports.Variable = Variable;
exports.Analyser = Analyser;