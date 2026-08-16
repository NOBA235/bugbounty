import type { Challenge } from "@/types/challenge";

export const FALLBACK_CHALLENGES: Challenge[] = [
  {
    id: "fb-closures-1",
    title: "The Shared Loop Variable",
    topic: "Closures",
    difficulty: "easy",
    description: "This function should return an array of functions. When each is called, it should return its own index. Currently every function returns the same value.",
    reproduction: "createCallbacks(3) → [fn0,fn1,fn2]. Calling any returns 3 instead of 0,1,2.",
    expectedBehavior: "Each callback closes over its own index.",
    starterCode: `function createCallbacks(n) {
  const callbacks = [];
  for (var i = 0; i < n; i++) {
    callbacks.push(function () {
      return i;
    });
  }
  return callbacks;
}`,
    solution: `function createCallbacks(n) {
  const callbacks = [];
  for (let i = 0; i < n; i++) {
    callbacks.push(function () {
      return i;
    });
  }
  return callbacks;
}`,
    tests: [
      { name: "Basic length 3", input: 3, expected: [0, 1, 2] },
      { name: "Length 1", input: 1, expected: [0] },
      { name: "Length 5", input: 5, expected: [0, 1, 2, 3, 4] },
      { name: "Length 0", input: 0, expected: [] },
    ],
    hints: [
      "Look at when the callback captures the loop variable.",
      "Closures retain references, not values at creation time.",
      "var is function-scoped and shared across callbacks.",
      "let creates a new binding per iteration.",
    ],
    timeLimit: 180, baseXp: 150,
  },
  {
    id: "fb-promises-1",
    title: "The Vanishing Promise",
    topic: "Promises",
    difficulty: "medium",
    description: "fetchUserData should return a Promise that resolves to the user object. Currently resolve is never called with the value.",
    starterCode: `function fetchUserData(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!username) {
        reject(new Error("Username required"));
        return;
      }
      const user = { name: username, role: username === "alice" ? "admin" : "user" };
      resolve;
    }, 20);
  });
}`,
    solution: `function fetchUserData(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!username) {
        reject(new Error("Username required"));
        return;
      }
      const user = { name: username, role: username === "alice" ? "admin" : "user" };
      resolve(user);
    }, 20);
  });
}`,
    tests: [
      { name: "Alice is admin", input: "alice", expected: { name: "alice", role: "admin" } },
      { name: "Bob is user", input: "bob", expected: { name: "bob", role: "user" } },
      { name: "Empty rejects", input: "", expected: "__REJECT__" },
    ],
    hints: [
      "Check how resolve is being used inside the Promise executor.",
      "resolve is a function — call it with the value.",
      "The line currently says just 'resolve;'.",
      "Call resolve(user).",
    ],
    timeLimit: 300, baseXp: 300,
  },
  {
    id: "fb-arrays-1",
    title: "Mutating Filter",
    topic: "Array Methods",
    difficulty: "easy",
    description: "uniqueValues should return a new array of unique values preserving order. Current code mutates the input.",
    starterCode: `function uniqueValues(arr) {
  const seen = {};
  for (let i = 0; i < arr.length; i++) {
    if (seen[arr[i]]) {
      arr.splice(i, 1);
      i--;
    } else {
      seen[arr[i]] = true;
    }
  }
  return arr;
}`,
    solution: `function uniqueValues(arr) {
  const seen = new Set();
  const result = [];
  for (const item of arr) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}`,
    tests: [
      { name: "Duplicates", input: [1, 2, 2, 3, 1], expected: [1, 2, 3] },
      { name: "All unique", input: [4, 5, 6], expected: [4, 5, 6] },
      { name: "Empty", input: [], expected: [] },
      { name: "Strings", input: ["a", "b", "a", "c", "b"], expected: ["a", "b", "c"] },
    ],
    hints: [
      "Avoid mutating while iterating.",
      "Build a new result array.",
      "A Set tracks seen values well.",
      "Push unseen items into a fresh array.",
    ],
    timeLimit: 180, baseXp: 150,
  },
  {
    id: "fb-async-1",
    title: "Await in a Loop",
    topic: "Promises",
    difficulty: "hard",
    description: "processItems should process items sequentially and return results in order. forEach does not await.",
    starterCode: `async function processItems(items) {
  const results = [];
  items.forEach(async (item) => {
    const result = await fakeAsync(item);
    results.push(result);
  });
  return results;
}
function fakeAsync(n) {
  return new Promise((resolve) => setTimeout(() => resolve("r" + n), 10));
}`,
    solution: `async function processItems(items) {
  const results = [];
  for (const item of items) {
    const result = await fakeAsync(item);
    results.push(result);
  }
  return results;
}
function fakeAsync(n) {
  return new Promise((resolve) => setTimeout(() => resolve("r" + n), 10));
}`,
    tests: [
      { name: "Three items", input: [1, 2, 3], expected: ["r1", "r2", "r3"] },
      { name: "Single", input: [7], expected: ["r7"] },
      { name: "Empty", input: [], expected: [] },
    ],
    hints: [
      "forEach does not wait for async callbacks.",
      "Use a for...of loop that supports await.",
      "Collect results after each await.",
      "Replace forEach with for...of.",
    ],
    timeLimit: 420, baseXp: 500,
  },
  {
    id: "fb-objects-1",
    title: "Shallow Copy Trap",
    topic: "Objects",
    difficulty: "medium",
    description: "cloneUser should deep-copy enough so nested changes on the clone do not affect the original.",
    starterCode: `function cloneUser(user) {
  return { ...user };
}`,
    solution: `function cloneUser(user) {
  return {
    ...user,
    address: user.address ? { ...user.address } : undefined,
  };
}`,
    tests: [
      { name: "Top-level independent", input: { name: "Ada", age: 36, address: { city: "London" } }, expected: "INDEPENDENT" },
      { name: "Nested independent", input: { name: "Ada", address: { city: "London", zip: "E1" } }, expected: "NESTED_INDEPENDENT" },
    ],
    hints: [
      "Spread only copies top-level properties.",
      "Nested objects remain shared by reference.",
      "Also copy the address object.",
      "Spread user and replace address with a new object.",
    ],
    timeLimit: 300, baseXp: 300,
  },
  {
    id: "fb-eventloop-1",
    title: "Microtask Ordering",
    topic: "Event Loop",
    difficulty: "medium",
    description: "Return the correct execution order of sync, promise, and timeout pushes.",
    starterCode: `function getOrder() {
  const order = [];
  order.push(1);
  setTimeout(() => order.push(2), 0);
  Promise.resolve().then(() => order.push(3));
  order.push(4);
  return order;
}`,
    solution: `function getOrder() {
  return [1, 4, 3, 2];
}`,
    tests: [{ name: "Correct order", input: null, expected: [1, 4, 3, 2] }],
    hints: [
      "Sync first, then microtasks, then macrotasks.",
      "push(1) and push(4) are synchronous.",
      "Promise.then runs before setTimeout.",
      "Order is 1, 4, 3, 2.",
    ],
    timeLimit: 300, baseXp: 300,
  },
  {
    id: "fb-functions-1",
    title: "Lost This Context",
    topic: "Functions",
    difficulty: "medium",
    description: "Counter.buttonHandler should increment count when called as a method.",
    starterCode: `function createCounter() {
  return {
    count: 0,
    buttonHandler: function () {
      this.count += 1;
    },
  };
}`,
    solution: `function createCounter() {
  return {
    count: 0,
    buttonHandler: function () {
      this.count += 1;
    },
  };
}`,
    tests: [
      { name: "Bound method works", input: "bound", expected: 1 },
      { name: "Unbound loses this", input: "unbound", expected: 0 },
    ],
    hints: [
      "Extracting a method loses this binding.",
      "Arrow functions or bind can help.",
      "Ensure calling as obj.buttonHandler() works.",
      "The tests exercise both bound and unbound calls.",
    ],
    timeLimit: 300, baseXp: 300,
  },
  {
    id: "fb-dom-1",
    title: "Event Listener Once",
    topic: "DOM",
    difficulty: "hard",
    description: "attachOnce should add a click listener that fires only once.",
    starterCode: `function attachOnce(element, handler) {
  element.addEventListener("click", handler);
}`,
    solution: `function attachOnce(element, handler) {
  element.addEventListener("click", handler, { once: true });
}`,
    tests: [{ name: "Fires once", input: "once", expected: 1 }],
    hints: [
      "addEventListener accepts options as third arg.",
      "The once option removes the listener after first run.",
      "Or removeEventListener inside the handler.",
      "Pass { once: true }.",
    ],
    timeLimit: 420, baseXp: 500,
  },
];

export function getFallbackByTopic(topic?: string, difficulty?: string): Challenge {
  let pool = FALLBACK_CHALLENGES;
  if (topic && topic !== "All") {
    const f = pool.filter(c => c.topic.toLowerCase().includes(topic.toLowerCase()));
    if (f.length) pool = f;
  }
  if (difficulty) {
    const f = pool.filter(c => c.difficulty === difficulty);
    if (f.length) pool = f;
  }
  const idx = Math.floor(Math.random() * pool.length);
  return { ...pool[idx], id: `${pool[idx].id}-${Date.now()}` };
}

export function getDailyFallback(): Challenge {
  const day = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < day.length; i++) hash = (hash * 31 + day.charCodeAt(i)) % FALLBACK_CHALLENGES.length;
  const base = FALLBACK_CHALLENGES[Math.abs(hash)];
  return { ...base, id: `daily-${day}`, title: `Daily: ${base.title}`, baseXp: (base.baseXp || 300) + 200 };
}
