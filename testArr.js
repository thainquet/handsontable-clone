const arr = [
  ["1", "2", "3", "4"],
  ["1", "2", "3", "4"],
  ["1", "2", "3", "4"],
  ["1", "2", "3", "4"],
  ["1", "2", "3", "4"],
];
const subArr = [
  ["a", "b"],
  ["c", "d"],
];

function embed(subArr, arr, ioff, joff) {
  subArr.forEach((r, i) => r.forEach((v, j) => (arr[ioff + i][joff + j] = v)));
}

embed(subArr, arr, 1, 1);
console.log(arr);

let tmpArr = [
  ["a", 5],
  ["b", 5],
  ["x", 6],
  ["y", 6],
];
