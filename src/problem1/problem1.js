var sum_to_n_a = function(n) {
  // your code here
  // The first approach: Iteration
  let sum = 0;
  for(let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_b = function(n) {
  // your code here
  // The second approach: Recursive
  if(n === 0) {
    return 0;
  }
  return n + sum_to_n_c(n - 1);
};

var sum_to_n_c = function(n) {
  // your code here
  // The third approach: Using math equation: Sum from 1 to n is equal to (n * (n-1))/2
  return (n * (n + 1)) / 2
};

console.log(sum_to_n_a(5))
console.log(sum_to_n_b(5))
console.log(sum_to_n_c(5))