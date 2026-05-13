const DE_MONTHS = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];

export function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return `${d.getDate()} ${DE_MONTHS[d.getMonth()]}`;
}

export function nightsBetween(from, to) {
  if (!from || !to) return 0;
  return Math.round((new Date(to+'T12:00:00') - new Date(from+'T12:00:00')) / 86400000);
}
