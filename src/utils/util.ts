export const getItemByPos = (pos, options) => {
  if (!pos || !options) {
    return null;
  }
  return pos
    .split('-')
    .slice(1)
    .reduce((ret, num) => ret.children[num], { children: options });
};

export const withNoAddonRequestParams = () => ({});
