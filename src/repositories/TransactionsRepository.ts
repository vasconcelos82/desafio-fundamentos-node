import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

enum Type {
  Income = 'income',
  Outcome = 'outcome',
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private calculateBalance(operator: Type): number {
    return this.transactions
      .filter(t => t.type === operator)
      .reduce((accum, curr) => accum + curr.value, 0);
  }

  public getBalance(): Balance {
    const income = this.calculateBalance(Type.Income);
    const outcome = this.calculateBalance(Type.Outcome);
    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const { total } = this.getBalance();
    if (type === Type.Outcome && total < value) {
      throw Error('Transaction is not allowed without a valid balance');
    }
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
