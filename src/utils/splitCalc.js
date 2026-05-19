// Adults are family members with splitShare > 0 (default: 1 if not set)
export function calcBalances(family, unsettledExpenses) {
  const adults = family.filter(f => (f.splitShare ?? 1) > 0);
  const n = adults.length || 1;
  const bal = {};
  family.forEach(f => { bal[f.id] = 0; });
  unsettledExpenses.forEach(e => {
    const each = e.amt / n;
    adults.forEach(f => {
      bal[f.id] += f.id === e.payerId ? e.amt - each : -each;
    });
  });
  return bal;
}

export function findCreditorDebtor(family, bal) {
  let creditor = null, debtor = null;
  family.forEach(f => {
    const b = bal[f.id] || 0;
    if (b > 0 && (!creditor || b > bal[creditor.id])) creditor = f;
    if (b < 0 && (!debtor  || b < bal[debtor.id]))   debtor   = f;
  });
  return { creditor, debtor };
}

export function defaultPayer(family) {
  return (
    family.find(f => f.defaultPayer) ||
    family.find(f => (f.splitShare ?? 1) > 0) ||
    family[0]
  );
}
