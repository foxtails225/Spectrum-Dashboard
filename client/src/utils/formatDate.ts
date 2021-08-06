export const formatDate = (value: number, delta: number, type?: string) => {
  if (!value) return '';

  let sDate = Math.floor(value - 25569) * 86400;
  let lDate = new Date(sDate * 1000);
  let d = lDate.getDate();
  let dd = d < 10 ? '0' + d : d;
  let yyyy = lDate.getFullYear();
  let mon = lDate.getMonth() + 1;
  let mm = mon < 10 ? '0' + mon : mon;
  return type === 'table'
    ? mm + '-' + dd + '-' + yyyy
    : yyyy + delta + '-' + mm + '-' + dd;
};

export const getMiddleDate = (start: number, end: number) => {
  if (!start) return '';

  let sDate = Math.floor(start - 25569) * 86400;
  let tDate = Math.floor(end - 25569) * 86400;
  let lDate = new Date(((sDate + tDate) / 2) * 1000);
  let d = lDate.getDate();
  let dd = d < 10 ? '0' + d : d;
  let yyyy = lDate.getFullYear();
  let mon = lDate.getMonth() + 1;
  let mm = mon < 10 ? '0' + mon : mon;

  return yyyy + '-' + mm + '-' + dd;
};
