import { assert } from "chai";
import { AccountBalanceComparison } from "../../src/AccountBalanceComparison";
import { AccountTypeProcessor } from "../../src/AccountTypeProcessor";
import { MonthAccountBalanceHistory } from "../../src/Entity/MonthAccountBalanceHistory";
import { AccountType } from "../../src/Enum/AccountType";

describe("Integration test for account type processor", () => {

    let processor: AccountTypeProcessor;

    before(() => {
        processor = new AccountTypeProcessor(new AccountBalanceComparison());
    })

    it("should return 'B' account type based on the example provided", () => {
        let accountBalanceHistory: MonthAccountBalanceHistory[] = [
            {
                monthNumber: 0, // current month
                account: {
                    balance: { amount: 0 },
                }
            },
            {
                monthNumber: 1, // last month
                account: {
                    balance: { amount: 100 },
                }
            },
            {
                monthNumber: 2, // two months ago
                account: {
                    balance: { amount: 200 },
                }
            }
        ];

        assert.equal(processor.process(accountBalanceHistory), AccountType.SAME_MONTHLY_DECREASE);
    });

    it("should return 'A' account type if the balance variation is variable", () => {
        let accountBalanceHistory: MonthAccountBalanceHistory[] = [
            {
                monthNumber: 0, // current month
                account: {
                    balance: { amount: 0 },
                }
            },
            {
                monthNumber: 1, // last month
                account: {
                    balance: { amount: 200 },
                }
            },
            {
                monthNumber: 2, // two months ago
                account: {
                    balance: { amount: 200 },
                }
            }
        ];

        assert.equal(processor.process(accountBalanceHistory), AccountType.VARIABLE_MONTHLY_DECREASE);
    });

});