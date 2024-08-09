export const getReadPercentage = (scrollValue, contentSize, containerSize) => {
  // const scrollPercentage = scrollValue / (contentSize - containerSize);
  // return (containerSize * scrollPercentage + scrollValue) / contentSize * 100;
  const Q = (containerSize / (contentSize - containerSize) + 1) / contentSize * 100;
  return scrollValue * Q;
};

export const getScrollValue = (readPercentage, contentSize, containerSize) => {
  const Q = (containerSize / (contentSize - containerSize) + 1) / contentSize * 100;
  return readPercentage / Q;
};