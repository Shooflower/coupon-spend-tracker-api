export type ExpenseEntry = {
    _id?: string,
    expenseType?: string,
    store?: string,
    amount?: number,
    displayAmount?: string,
    tax?: number
    displayTax?: string,
    total: number,
    purchaseDate: string
}