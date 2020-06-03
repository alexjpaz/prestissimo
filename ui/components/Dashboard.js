import React from 'react';

import { Link } from "react-router-dom"

import { PrestissimoApi } from '../helpers/PrestissimoApi';

import { AppContext } from './AppContext';

export function TransactionList({ items }) {
  if(!items) {
    return null;
  }

  return (
    <div class="list is-hoverable">
      { items.map(item => <TransactionListItem item={item} />) }
    </div>
  );
}

export function TransactionListItem({ item }) {
  let to = `/transactions/${item.transactionId}`;

  return (
    <Link className="list-item" to={to}>
      { item.name || item.transactionId }
    </Link>
  );
}

export function Dashboard() {
  const ctx = React.useContext(AppContext);

  const [ transactions, setTransactions ] = React.useState(null);

  React.useEffect(() => {
    (async function() {
      const { data } = await ctx.fetchTransactions();

      setTransactions(data);
    })();
  }, [ ]);

  if(!transactions) {
    return <h1>LO ADD ING</h1>
  }

  return (
    <section className="section">
      <div className="columns">
        <div className="column is-one-quarter">
          <TransactionList items={transactions} />
        </div>
      </div>
    </section>
  );
}
