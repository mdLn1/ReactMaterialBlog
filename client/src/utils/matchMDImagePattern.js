export function containsMDImage(text) {
  let re = /\!\[(.*?)\]\((.*?)\)/g;
  return re.test(text);
}

export function findAllMdImages(text) {
  let re = /\!\[(.*?)\]\((.*?)\)/g;
  return text.match(re);
}

export function findNumberOfMdImages(text) {
  let allMdImages = findAllMdImages(text);
  return allMdImages ? allMdImages.length : 0;
}
