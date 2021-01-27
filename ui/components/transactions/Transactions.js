import React from 'react';

import { useParams } from 'react-router-dom';

import { AppContext } from '../AppContext';

export function Transactions() {
  const { transactionId } = useParams();

  const ctx = React.useContext(AppContext);

  const [ transaction, setTransaction ] = React.useState(null);

  React.useEffect(() => {
    (async function() {
      const { data } = await ctx.fetchTransaction(transactionId);

      setTransaction(data);
    })();
  }, [ ]);

  if(!transaction) {
    return null;
  }

  return (
    <pre>{JSON.stringify(transaction, null, 2)}</pre>
  );
}
