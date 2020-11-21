export default function (text) {
  let re = /\!\[(.*?)\]\((.*?)\)/g;
  return re.test(text);
}
