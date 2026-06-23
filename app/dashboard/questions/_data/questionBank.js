// Curated interview question bank. Used by the Questions page; users can also
// generate more questions per category with AI.

export const questionBank = [
  {
    category: 'Behavioral',
    blurb: 'Storytelling and soft-skill questions asked in almost every interview.',
    questions: [
      { q: 'Tell me about yourself.', a: 'Give a 60–90s summary: who you are professionally, 1–2 relevant achievements with impact, and why you are excited about this role. Keep it tailored to the job, not your life story.' },
      { q: 'Describe a time you faced a conflict in a team and how you resolved it.', a: 'Use STAR: set the Situation, your Task, the Actions you took to understand both sides and find common ground, and the Result. Emphasize communication and outcome.' },
      { q: 'Tell me about a time you failed.', a: 'Pick a real failure, own it without blaming others, explain what you learned, and how you applied that lesson later. Show growth, not perfection.' },
      { q: 'Describe a project you are most proud of.', a: 'Choose something relevant. Explain the problem, your specific contribution, the tech/approach, and a measurable result (users, performance, revenue, time saved).' },
      { q: 'How do you handle tight deadlines and pressure?', a: 'Describe prioritization (impact vs effort), communicating trade-offs early, breaking work into milestones, and a concrete example where you delivered under pressure.' },
      { q: 'Where do you see yourself in five years?', a: 'Show ambition aligned with the role: growing depth in your craft, taking on more ownership/leadership, and contributing to the kind of problems the company solves.' },
    ],
  },
  {
    category: 'JavaScript',
    blurb: 'Core language concepts every web role expects you to know.',
    questions: [
      { q: 'What is the difference between == and ===?', a: '== compares values with type coercion; === compares value AND type with no coercion (strict equality). Prefer === to avoid surprising conversions.' },
      { q: 'Explain closures with an example.', a: 'A closure is a function that retains access to variables from its enclosing lexical scope even after that scope has returned — e.g. a counter factory that keeps a private count variable.' },
      { q: 'What is the event loop?', a: 'JS is single-threaded; the event loop processes the call stack, then microtasks (Promises), then the macrotask queue (timers, I/O), enabling non-blocking async behavior.' },
      { q: 'Difference between var, let and const?', a: 'var is function-scoped and hoisted; let and const are block-scoped. const cannot be reassigned (but objects it holds are still mutable). Prefer const, then let.' },
      { q: 'What are Promises and async/await?', a: 'A Promise represents a future value (pending → fulfilled/rejected). async/await is syntactic sugar over Promises that lets you write asynchronous code in a synchronous-looking style with try/catch.' },
      { q: 'Explain "this" in JavaScript.', a: 'this depends on how a function is called: the object before the dot for methods, the global/undefined for plain calls (strict mode), the bound value with bind/call/apply, and the lexical enclosing this for arrow functions.' },
    ],
  },
  {
    category: 'React',
    blurb: 'Component model, hooks, and rendering — for frontend roles.',
    questions: [
      { q: 'What is the virtual DOM and why does React use it?', a: 'A lightweight in-memory representation of the UI. React diffs the new vs old virtual DOM and applies the minimal set of real DOM updates, which is faster and more predictable than manual DOM manipulation.' },
      { q: 'Difference between state and props?', a: 'Props are read-only inputs passed from a parent; state is internal, mutable data managed within a component. Changing either triggers a re-render.' },
      { q: 'What does the useEffect hook do?', a: 'Runs side effects (data fetching, subscriptions, timers) after render. The dependency array controls when it re-runs; returning a function provides cleanup.' },
      { q: 'What are keys and why are they important in lists?', a: 'Keys give list items a stable identity so React can match elements between renders, avoiding unnecessary re-renders and bugs. Use stable unique ids, not array indexes when the list can reorder.' },
      { q: 'When would you use useMemo or useCallback?', a: 'To memoize expensive computed values (useMemo) or stable function references (useCallback) so children do not re-render needlessly. Use them when you have a measured performance problem, not by default.' },
      { q: 'How do you manage global state in React?', a: 'Options: Context for low-frequency global values, or libraries like Redux/Zustand/Jotai for larger apps. Choose based on update frequency and complexity; avoid over-engineering.' },
    ],
  },
  {
    category: 'Data Structures & Algorithms',
    blurb: 'Fundamentals tested in technical and coding rounds.',
    questions: [
      { q: 'Explain Big-O notation.', a: 'It describes how an algorithm’s time or space grows with input size, ignoring constants. Common: O(1), O(log n), O(n), O(n log n), O(n²). It lets you compare scalability.' },
      { q: 'Difference between an array and a linked list?', a: 'Arrays give O(1) random access but O(n) insertion/deletion in the middle; linked lists give O(1) insert/delete given a node but O(n) access. Choose based on access vs mutation patterns.' },
      { q: 'How does a hash map achieve O(1) lookup?', a: 'It hashes the key to an index in a backing array. Collisions are handled (chaining or open addressing). Average lookup/insert is O(1); worst case O(n) with many collisions.' },
      { q: 'When would you use a stack vs a queue?', a: 'Stack (LIFO) for undo, recursion, expression parsing, DFS. Queue (FIFO) for scheduling, BFS, and buffering. Pick based on the order you need to process items.' },
      { q: 'Explain binary search and its requirement.', a: 'It repeatedly halves a sorted range to find a target in O(log n). The requirement is that the data must be sorted (or monotonic on the property you search).' },
      { q: 'What is the difference between DFS and BFS?', a: 'DFS explores as deep as possible before backtracking (stack/recursion); BFS explores level by level (queue) and finds the shortest path in unweighted graphs.' },
    ],
  },
  {
    category: 'System Design',
    blurb: 'High-level architecture questions for mid/senior roles.',
    questions: [
      { q: 'How would you design a URL shortener?', a: 'Generate a short unique key (base62 of an id or hash), store key→URL in a fast key-value store, redirect on lookup, add caching for hot links, and plan for scale, collisions, and analytics.' },
      { q: 'What is the difference between SQL and NoSQL?', a: 'SQL (relational) gives structured schemas, joins, and ACID transactions — great for complex relationships. NoSQL (document/key-value/column) trades joins for scale and flexible schemas. Choose based on data shape and consistency needs.' },
      { q: 'How do you scale a web application?', a: 'Vertical first, then horizontal: load balancers, stateless app servers, caching (CDN, Redis), database read replicas/sharding, async queues for heavy work, and monitoring. Identify the bottleneck before scaling.' },
      { q: 'What is caching and where would you apply it?', a: 'Storing computed/fetched data closer to the consumer to reduce latency and load. Layers: browser, CDN, application (Redis/Memcached), and database query cache. Mind invalidation and TTLs.' },
      { q: 'Explain the CAP theorem.', a: 'In a distributed system you can guarantee at most two of Consistency, Availability, and Partition tolerance. Since partitions happen, you typically trade consistency vs availability (CP vs AP).' },
      { q: 'How do you ensure reliability in a distributed system?', a: 'Redundancy and failover, retries with backoff and idempotency, circuit breakers, health checks, graceful degradation, observability (logs/metrics/traces), and well-tested rollbacks.' },
    ],
  },
  {
    category: 'SQL & Databases',
    blurb: 'Querying and data modeling questions for data and backend roles.',
    questions: [
      { q: 'What is the difference between INNER JOIN and LEFT JOIN?', a: 'INNER JOIN returns only matching rows in both tables; LEFT JOIN returns all rows from the left table plus matches from the right (NULLs where no match).' },
      { q: 'What is an index and what is the trade-off?', a: 'An index speeds up reads/lookups by maintaining a sorted structure on columns, at the cost of extra storage and slower writes. Index the columns you filter/join/sort on.' },
      { q: 'Explain database normalization.', a: 'Organizing tables to reduce redundancy and anomalies (1NF→3NF). It improves integrity but can require more joins; denormalize selectively for read performance.' },
      { q: 'What is a transaction and what does ACID mean?', a: 'A transaction is a unit of work that succeeds or fails as a whole. ACID = Atomicity, Consistency, Isolation, Durability — guarantees that keep data correct under concurrency and failures.' },
      { q: 'Difference between WHERE and HAVING?', a: 'WHERE filters rows before grouping; HAVING filters groups after GROUP BY aggregation. Use WHERE for row conditions and HAVING for aggregate conditions.' },
      { q: 'How would you find the second-highest salary?', a: 'Use SELECT MAX(salary) FROM emp WHERE salary < (SELECT MAX(salary) FROM emp); or a window function: DENSE_RANK() OVER (ORDER BY salary DESC) and filter rank = 2.' },
    ],
  },
];
