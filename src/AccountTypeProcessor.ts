import { AccountBalanceComparison } from "./AccountBalanceComparison";
import { MonthAccountBalanceHistory } from "./Entity/MonthAccountBalanceHistory";
import { AccountType } from "./Enum/AccountType";

export class AccountTypeProcessor {
    protected balanceComparison: AccountBalanceComparison;

    constructor(balanceComparison: AccountBalanceComparison) {
        this.balanceComparison = balanceComparison;
    }

    process(history: MonthAccountBalanceHistory[]): AccountType {
        if (history.length <= 2) {
            throw new Error("To reliably determine an account type indicator, more than 2 months history is required");
        }

        return this.isMonthlyDeductionsSame(history) ? AccountType.SAME_MONTHLY_DECREASE : AccountType.VARIABLE_MONTHLY_DECREASE;
    }

    protected isMonthlyDeductionsSame(history: MonthAccountBalanceHistory[]): boolean {
        let monthlyDeductionAmount: number;

        return history.every(
            (currentMonthBalanceHistory, index) => {
                let previousMonthBalanceHistory = history[++index];
                let deductionAmount = this.balanceComparison.compare(currentMonthBalanceHistory.account.balance, previousMonthBalanceHistory?.account.balance);

                if (deductionAmount === undefined) {
                    return true;
                }

                if (monthlyDeductionAmount === undefined) {
                    monthlyDeductionAmount = deductionAmount;
                }

                return deductionAmount === monthlyDeductionAmount;
            }
        );
    }
}