export const rand = () => Math.random();
export const randInt = (maxOrMin, max) => {
  if (max !== undefined) {
    return Math.floor(Math.random() * (max - maxOrMin) + maxOrMin);
  }
  return Math.floor(Math.random() * maxOrMin);
}
export const randBool = () => Math.random() < 0.5;
export const choice = (choices) => {
  const i = Math.floor(Math.random() * choices.length);
  return choices[i];
}