interface Transaction {
    amount: number;
    currencyCode: string;
    category: { id: string; name: string } | null;
    description: string | null;
    title: string;
    type: $Enums.TransactionType;
    createdAt: Date;
    updatedAt: Date;
    txid: string;
    date: Date;
}
