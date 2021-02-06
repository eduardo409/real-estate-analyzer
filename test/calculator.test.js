const Loan = require('../src/calculator').Loan
const Asset = require('../src/calculator').Asset
const Analyser = require('../src/calculator').Analyser

beforeEach(() => {
});

afterEach(() => {
});

describe('Class: Loan', () => {

    var validApr = 3.5;
    var validPrinciple = 100000;
    var validTerm = 30;
    const YEARLY_PAYMENT_FREQUENCY = 12
    let expectedPrinciple = 100000;
    let expectedApr = 0.035;
    let expectedTerm = 30;
    let expectedInterestCost = "61656.088";
    let expectedTotalNumberOfPayments = expectedTerm * YEARLY_PAYMENT_FREQUENCY;
    let validLoan = new Loan(validPrinciple, validApr, validTerm);
    let expectedRatePerperiod = expectedApr / YEARLY_PAYMENT_FREQUENCY;
    let validStringLoan = new Loan("100000", "3.5", "30");

    describe('Given a valid apr, principle and term', () => {
        test('getInitialPrincipal() should return valid value', () => {
            expect(validLoan.getInitialPrincipal()).toBe(expectedPrinciple);
        });
        test('getInterestRate() should return valid value', () => {
            expect(validLoan.getInterestRate()).toBe(expectedApr);
        });
        test('getTermInYears() should retun valid value', () => {
            expect(validLoan.getTermInYears()).toBe(expectedTerm);
        });
        test('calTotalNumberOfPayments() should retun valid value', () => {
            expect(validLoan.calTotalNumberOfPayments()).toBe(expectedTotalNumberOfPayments);
        });
        test('calRatePerPeriod() should retun valid value', () => {
            expect(validLoan.calRatePerPeriod()).toBe(expectedRatePerperiod);
        });
        test('calSchedule() should retun valid size', () => {
            expect(validLoan.calSchedule().length).toBe(expectedTotalNumberOfPayments);
        });
        test('calSchedule() should retun valid interest costs', () => {
            expect(validLoan.calSchedule().slice(-1)[0].totalInterest).toBe(expectedInterestCost);
        });
    });
    describe('Given a valid string apr, string principle and string term', () => {
        test('getInitialPrincipal() should return valid value', () => {
            expect(validStringLoan.getInitialPrincipal()).toBe(expectedPrinciple);
        });
        test('getInterestRate() should return valid value', () => {
            expect(validStringLoan.getInterestRate()).toBe(expectedApr);
        });
        test('getTermInYears() should return valid value', () => {
            expect(validStringLoan.getTermInYears()).toBe(expectedTerm);
        });

    });
});

describe('Class: Asset', () => {
    describe('Given valid asset parameters', () => {
        let name = "301 indiana Ave";
        let negativeCost = 3000.0;
        let squareFt = 1000.3;
        let value = 100000;

        const asset = new Asset(name, negativeCost, squareFt, value)
        test('getName() should initailize', () => {
            expect(asset.getName()).toBe(name);
        });
        test('getValue() should initailize', () => {
            expect(asset.getValue()).toBe(value);
        });
        test('getNegativeCost() should initailize', () => {
            expect(asset.getCostToMakeRentReady()).toBe(negativeCost);
        });
        test('getSquareFt() should initailize', () => {
            expect(asset.getSquareFt()).toBe(squareFt);
        });

    });
    describe('Given valid asset string parameters', () => {
        let name = "301 indiana Ave";
        let negativeCost = "3000.0";
        let squareFt = "1000.301";
        let value = "100000.999";
        let expectedNegativeCost = 3000.0;
        let expectedSquareFt = 1000.301;
        let expectedValue = 100000.999;

        const asset = new Asset(name, negativeCost, squareFt, value)
        test('getName() should initailize', () => {
            expect(asset.getName()).toBe(name);
        });
        test('getValue() should initailize', () => {
            expect(asset.getValue()).toBe(expectedValue);
        });
        test('getNegativeCost() should initailize', () => {
            expect(asset.getCostToMakeRentReady()).toBe(expectedNegativeCost);
        });
        test('getSquareFt() should initailize', () => {
            expect(asset.getSquareFt()).toBe(expectedSquareFt);
        });

    });

});

describe('Class: Analyser', () => {
    let name = "301 indiana Ave";
    let negativeCost = 10000.0;
    let squareFt = 2000.0;
    let value = 215000;
    const asset = new Asset(name, negativeCost, squareFt, value)

    var validApr = 4;
    var validPrinciple = 206400;
    var validTerm = 30;
    let validLoan = new Loan(validPrinciple, validApr, validTerm);

    let down = 4;
    let closingCost = 2;
    let expense = 4152
    let income = 24000
    let vacancy = 2000


    describe('Given valid parameters', () => {
        let validAnalysis = new Analyser(asset, validLoan, down, income, expense, vacancy, closingCost);
        let expectedDown = .04
        let expectedClosingClostPercentage = .02
        let expectedIncome = 24000.0
        let expectedExpense = 4152.0
        let expectedEGI = 22000
        let expectedNOI = 17848
        let expectedDebtService = 11825
        let expectedcashflow = 6023
        let expectedDownPayment = 8600
        let expectedLeverage = 206400
        let expectedClosingClostValue = 4128
        let expectedcapital = 22728
        let expectedCashOnCash = .2650

        test('getPercentDown() should retun valid downpayment float', () => {
            expect(validAnalysis.getPercentDown()).toBe(expectedDown);
        });
        test('calculateLeverage() should retun leverage', () => {
            expect(validAnalysis.calculateLeverage()).toBe(expectedLeverage);
        });
        test('getPercentClosingCost() should retun valid downpayment float', () => {
            expect(validAnalysis.getPercentClosingCost()).toBe(expectedClosingClostPercentage);
        });
        test('getAsset() should retun valid asset object', () => {
            expect(validAnalysis.getAsset()).toBe(asset);
        });
        test('getLoan() should retun valid loan object', () => {
            expect(validAnalysis.getLoan()).toBe(validLoan);
        });
        test('getIncome() should retun valid Income value', () => {
            expect(validAnalysis.getIncome()).toBe(expectedIncome);
        });
        test('getExpense() should retun valid Income value', () => {
            expect(validAnalysis.getExpense()).toBe(expectedExpense);
        });
        test('getExpense() should retun valid Income value', () => {
            expect(validAnalysis.getVacancy()).toBe(vacancy);
        });
        test('calculateEGI() should retun valid EGI', () => {
            expect(validAnalysis.calculateEGI()).toBe(expectedEGI);
        });
        test('calculateNOI() should retun valid EGI', () => {
            expect(validAnalysis.calculateNOI()).toBe(expectedNOI);
        });
        test('expectedDebtService() should retun valid yearly DebtService', () => {
            expect(validAnalysis.calculateDebtService()).toBe(expectedDebtService);
        });
        test('calculateCashFlow() should retun valid yearly DebtService', () => {
            expect(validAnalysis.calculateCashFlow()).toBe(expectedcashflow);
        });
        test('calculateDownPayment() should retun downpayment', () => {
            expect(validAnalysis.calculateDownPayment()).toBe(expectedDownPayment);
        });
        test('calculateClosingCost() should retun closing cost', () => {
            expect(validAnalysis.calculateClosingCost()).toBe(expectedClosingClostValue);
        });
        test('calculateTotalCapitalRequired() should retun TCR', () => {
            expect(validAnalysis.calculateTotalCapitalRequired()).toBe(expectedcapital);
        });
        test('callculateCashOnCash() should retun cash on cash', () => {
            expect(validAnalysis.calculateCashOnCash()).toBe(expectedCashOnCash);
        });
        test('calculatePrinciplePaydown() should retun array size of 30', () => {
            expect(validAnalysis.calculatePrinciplePaydown().length).toBe(30);
        });
        test('calculatePrinciplePaydown() should retun correct value', () => {
            expect(validAnalysis.calculatePrinciplePaydown()[0]).toBe(3634.78);
            expect(validAnalysis.calculatePrinciplePaydown()[29]).toBe(11572.36);
        });      
          test('calculateNonApreciatedEquity() should retun array size of 30', () => {
            expect(validAnalysis.calculateNonApreciatedEquity().length).toBe(30);
        });

        test('calculateNonApreciatedEquity() should retun asset value for final year', () => {
            expect(validAnalysis.calculateNonApreciatedEquity()[29]).toBe(value);
        });

    });

    describe('Given valid attributes', () => {
        let validAnalysis = new Analyser();
        validAnalysis.setPercentDown(down);
        validAnalysis.setLoan(validLoan);
        validAnalysis.setAsset(asset);
        let expectedDown = .04

        test('getPercentDown() should retun valid downpayment float', () => {
            expect(validAnalysis.getPercentDown()).toBe(expectedDown);
        });
        test('getAsset() should retun valid asset object', () => {
            expect(validAnalysis.getAsset()).toBe(asset);
        });
        test('getLoan() should retun valid loan object', () => {
            expect(validAnalysis.getLoan()).toBe(validLoan);
        });
    });


});