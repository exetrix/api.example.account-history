import { BalanceInformation } from "./Entity/BalanceInformation";

export class AccountBalanceComparison {
    compare(currentMonthBalanceHistory: BalanceInformation, previousMonthBalanceHistory?: BalanceInformation): number | undefined {
        if (previousMonthBalanceHistory) {
            return Math.abs(previousMonthBalanceHistory.amount - currentMonthBalanceHistory.amount);
        }
    }
}