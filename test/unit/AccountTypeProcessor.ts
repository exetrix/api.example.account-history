import { assert, expect } from 'chai';
import { StubbedInstance, stubConstructor, stubInterface } from 'ts-sinon';
import { AccountBalanceComparison } from '../../src/AccountBalanceComparison';
import { AccountTypeProcessor } from '../../src/AccountTypeProcessor';
import { AccountInformation } from '../../src/Entity/AccountInformation';
import { BalanceInformation } from '../../src/Entity/BalanceInformation';
import { MonthAccountBalanceHistory } from '../../src/Entity/MonthAccountBalanceHistory';
import { AccountType } from '../../src/Enum/AccountType';

describe("When using the account type processor", () => {

    let balanceComparison: StubbedInstance<AccountBalanceComparison>;

    let currentMonthHistory: StubbedInstance<MonthAccountBalanceHistory>;
    let firstMonthHistory: StubbedInstance<MonthAccountBalanceHistory>;
    let secondMonthHistory: StubbedInstance<MonthAccountBalanceHistory>;

    let processor: AccountTypeProcessor;

    beforeEach(() => {
        balanceComparison = stubConstructor(AccountBalanceComparison);

        currentMonthHistory = createAccountHistory();
        firstMonthHistory = createAccountHistory();
        secondMonthHistory = createAccountHistory();

        processor = new AccountTypeProcessor(balanceComparison);
    });

    it("should return a type 'A' when the decrease amount is variable", () => {

        balanceComparison.compare.withArgs(currentMonthHistory.account.balance, firstMonthHistory.account.balance).returns(100);
        balanceComparison.compare.withArgs(firstMonthHistory.account.balance, secondMonthHistory.account.balance).returns(200);
        balanceComparison.compare.withArgs(secondMonthHistory.account.balance, undefined).returns(undefined);

        assert.equal(processor.process([currentMonthHistory, firstMonthHistory, secondMonthHistory]), AccountType.VARIABLE_MONTHLY_DECREASE);
    });

    it("should return a type 'B' when the decrease amount is the same", () => {
        
        balanceComparison.compare.withArgs(currentMonthHistory.account.balance, firstMonthHistory.account.balance).returns(100);
        balanceComparison.compare.withArgs(firstMonthHistory.account.balance, secondMonthHistory.account.balance).returns(100);
        balanceComparison.compare.withArgs(secondMonthHistory.account.balance, undefined).returns(undefined);

        assert.equal(processor.process([currentMonthHistory, firstMonthHistory, secondMonthHistory]), AccountType.SAME_MONTHLY_DECREASE);
    });

    it("should return a type 'B' when the decrease amount is the same taking into account floats", () => {
        
        balanceComparison.compare.withArgs(currentMonthHistory.account.balance, firstMonthHistory.account.balance).returns(100);
        balanceComparison.compare.withArgs(firstMonthHistory.account.balance, secondMonthHistory.account.balance).returns(100.00);
        balanceComparison.compare.withArgs(secondMonthHistory.account.balance, undefined).returns(undefined);

        assert.equal(processor.process([currentMonthHistory, firstMonthHistory, secondMonthHistory]), AccountType.SAME_MONTHLY_DECREASE);
    });

    it("should error when only one months history is provided", () => {
        expect(() => processor.process([currentMonthHistory])).to.throw(Error);
    });

    it("should error when only two months history is provided", () => {
        expect(() => processor.process([currentMonthHistory, firstMonthHistory])).to.throw(Error);
    });

    function createAccountHistory(): StubbedInstance<MonthAccountBalanceHistory> {
        let history = stubInterface<MonthAccountBalanceHistory>();
        history.account = stubInterface<AccountInformation>();
        history.account.balance = stubInterface<BalanceInformation>();
        return history;
    }
})