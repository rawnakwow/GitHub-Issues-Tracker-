# GitHub Issues Tracker

## Live Link : github-issues-tracker-wow.netlify.app


## Questions & Answer

### 1. Difference between var, let and const?
In javascript let, var, and const are used to declare variablrs, but they are different in scope. 

var
var is function-scoped and allows redeclaration and reassignment. 
Example : 
var a = 10;
var a = 20; 

let
let is block-scoped and can be reassigned but not redeclared in the same scope.
Example : 
let b = 10;
b= 20; 
but can not : 
let b =10;
let b = 20 ; // error

const 
Const is also block-scoped, but its value cannot be reassigned after initialization.
Once a value is assigned to a const variable, none can assign a new value to that variable later.
So, making it useful for values that should remain constant.

Example :
const c = 10;
 c = 20; // Error

### 2. What is Spread Operator?

Spread Operator is {...} an oparetor which allows an iterable such as an array or an object to be expanded into individual elements.
It is commonly used to copy arrays and pass multiple values to functions.
Example :
const user = { name: "Rawnak" };
const updatedUser = { ...user, age: 26 };

console.log(updatedUser);
// { name: "Rawnak", age: 26 }


### 3. Difference between map(), filter() and forEach()?
map(), filter() and forEach() are array methods used to process elements, but they have different purposes.

map() transforms every element and returns a new array of the same length.
filter() returns a new array containing only elements that satisfy a specified condition.
forEach() executes a function for each element in the array but does not return a new array.


### 4. What is Arrow Function?

An arrow function is a shorter syntax way of writing functions in JavaScript.
example :

const add = (a, b) => {
  return a + b;
};
or,
const add = (a, b) => a + b;


### 5. What are Template Literals?
Template literals are a modern way to create strings in JavaScript using backticks (`) instead of single or double quotes.

example :


with :

const name = "John";
const age = 25;
console.log(`My name is ${name} and I am ${age} years old.`);

with out :

const name = "John";
const age = 25;
console.log("My name is " + name + " and I am " + age + " years old.");


