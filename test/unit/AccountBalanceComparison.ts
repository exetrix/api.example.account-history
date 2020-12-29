import { assert } from 'chai';
import { AccountBalanceComparison } from '../../src/AccountBalanceComparison';
import { BalanceInformation } from '../../src/Entity/BalanceInformation';

describe("When using the account balance comparison", () => {

    let comparison: AccountBalanceComparison;

    beforeEach(() => {
        comparison = new AccountBalanceComparison();
    });

    it("should return the correct comparison result when both balances are populated", () => {
        let currentMonth = createBalance(100);
        let previousMonth = createBalance(200);

        assert.equal(comparison.compare(currentMonth, previousMonth), 100);
    });

    it("should handle negative balance values", () => {
        let currentMonth = createBalance(-100);
        let previousMonth = createBalance(0);

        assert.equal(comparison.compare(currentMonth, previousMonth), 100);
    });

    it("should return undefined if previous month is undefined", () => {
        assert.isUndefined(comparison.compare(createBalance(100)));
    });

    function createBalance(amount: number): BalanceInformation {
        return {
            amount: amount
        }
    }
})