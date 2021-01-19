const formatDate = (value: number, delta: number) => {
  if (!value) return '';

  let sDate = Math.floor(value - 25569) * 86400;
  let lDate = new Date(sDate * 1000);
  let d = lDate.getDate();
  let dd = d < 10 ? '0' + d : d;
  let yyyy = lDate.getFullYear();
  let mon = lDate.getMonth() + 1;
  let mm = mon < 10 ? '0' + mon : mon;

  return yyyy + delta + '-' + mm + '-' + dd;
};

export default formatDate;
