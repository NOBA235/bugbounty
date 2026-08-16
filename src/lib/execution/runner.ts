import type { ExecutionResult, TestCase } from "@/types/challenge";

export async function runTestsInWorker(
  code: string,
  tests: TestCase[],
  timeoutMs = 3000
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const workerCode = `
self.onmessage = async function(event) {
  const msg = event.data;
  if (msg.type !== "run") return;
  const timeoutMs = msg.timeoutMs || 3000;
  const consoleOutput = [];
  const originalLog = console.log;
  console.log = function() { consoleOutput.push(Array.prototype.slice.call(arguments).map(String).join(" ")); };
  const start = performance.now();
  let timedOut = false;
  const timer = setTimeout(function() {
    timedOut = true;
    self.postMessage({ type: "result", success: false, results: [], consoleOutput: consoleOutput, error: "Execution timed out", totalTime: timeoutMs, passedCount: 0, totalCount: msg.tests.length });
    self.close();
  }, timeoutMs);
  try {
    var code = msg.code;
    var fn = null;
    try {
      var factory = new Function(code + ";\\n return (typeof createCallbacks!=='undefined'&&createCallbacks)||(typeof fetchUserData!=='undefined'&&fetchUserData)||(typeof uniqueValues!=='undefined'&&uniqueValues)||(typeof cloneUser!=='undefined'&&cloneUser)||(typeof processItems!=='undefined'&&processItems)||(typeof getOrder!=='undefined'&&getOrder)||(typeof createCounter!=='undefined'&&createCounter)||(typeof attachOnce!=='undefined'&&attachOnce)||(typeof solution!=='undefined'&&solution)||(typeof main!=='undefined'&&main)||null;");
      fn = factory();
    } catch (syntaxErr) {
      clearTimeout(timer);
      self.postMessage({ type: "result", success: false, results: [], consoleOutput: consoleOutput, error: "Syntax error: " + (syntaxErr.message||String(syntaxErr)), totalTime: performance.now()-start, passedCount: 0, totalCount: msg.tests.length });
      return;
    }
    if (typeof fn !== "function") {
      var match = code.match(/function\\s+([a-zA-Z0-9_]+)/g);
      if (match && match.length) {
        var lastName = match[match.length-1].replace(/^function\\s+/, "").trim();
        try { fn = new Function(code + ";\\n return " + lastName + ";")(); } catch(e2) {}
      }
    }
    if (typeof fn !== "function") {
      clearTimeout(timer);
      self.postMessage({ type: "result", success: false, results: [], consoleOutput: consoleOutput, error: "No callable function found", totalTime: performance.now()-start, passedCount: 0, totalCount: msg.tests.length });
      return;
    }
    var results = [];
    var passedCount = 0;
    for (var i = 0; i < msg.tests.length; i++) {
      if (timedOut) break;
      var t = msg.tests[i];
      var name = t.name || ("Test #" + (i+1));
      var tStart = performance.now();
      try {
        if (t.expected === "__REJECT__") {
          try {
            var p = fn(t.input);
            if (p && typeof p.then === "function") { await p; results.push({ name: name, passed: false, error: "Expected rejection" }); }
            else results.push({ name: name, passed: false, error: "Expected rejection" });
          } catch(rej) { results.push({ name: name, passed: true, executionTime: performance.now()-tStart }); passedCount++; }
          continue;
        }
        if (t.expected === "INDEPENDENT" || t.expected === "NESTED_INDEPENDENT") {
          var original = JSON.parse(JSON.stringify(t.input));
          var clone = fn(t.input);
          if (!clone || typeof clone !== "object") { results.push({ name: name, passed: false, error: "Not an object" }); continue; }
          clone.name = "CHANGED";
          var nestedOk = true;
          if (t.expected === "NESTED_INDEPENDENT" && clone.address) { clone.address.city = "Paris"; nestedOk = t.input.address.city === original.address.city; }
          if (t.input.name === original.name && nestedOk) { results.push({ name: name, passed: true }); passedCount++; }
          else results.push({ name: name, passed: false, error: "Shared references" });
          continue;
        }
        if (Array.isArray(t.expected) && typeof t.input === "number") {
          var callbacks = fn(t.input);
          if (!Array.isArray(callbacks)) { results.push({ name: name, passed: false, error: "Expected array" }); continue; }
          var values = callbacks.map(function(cb) { return typeof cb === "function" ? cb() : undefined; });
          if (JSON.stringify(values) === JSON.stringify(t.expected)) { results.push({ name: name, passed: true }); passedCount++; }
          else results.push({ name: name, passed: false, error: "Got " + JSON.stringify(values) });
          continue;
        }
        if (t.expected === 1 && t.input === "once") {
          var calls = 0;
          var handler = function() { calls++; };
          var element = { listeners: [], addEventListener: function(type, fn, opts) { this.listeners.push({ type: type, fn: fn, opts: opts||{} }); },
            removeEventListener: function(type, fn) { this.listeners = this.listeners.filter(function(l) { return !(l.type===type && l.fn===fn); }); },
            click: function() { var copy = this.listeners.slice(); for (var li=0;li<copy.length;li++) { var l=copy[li]; if (l.type==="click") { l.fn(); if (l.opts&&l.opts.once) this.removeEventListener("click", l.fn); } } } };
          fn(element, handler); element.click(); element.click(); element.click();
          if (calls === 1) { results.push({ name: name, passed: true }); passedCount++; }
          else results.push({ name: name, passed: false, error: "Called " + calls + " times" });
          continue;
        }
        if (t.input === "bound" || t.input === "unbound") {
          var counter = fn();
          if (t.input === "bound") { counter.buttonHandler(); if (counter.count === 1) { results.push({ name: name, passed: true }); passedCount++; } else results.push({ name: name, passed: false, error: "count="+counter.count }); }
          else { var h = counter.buttonHandler; try { h(); } catch(e) {} if (counter.count === 0) { results.push({ name: name, passed: true }); passedCount++; } else results.push({ name: name, passed: false, error: "mutated" }); }
          continue;
        }
        var actual;
        var isAsync = fn.constructor && fn.constructor.name === "AsyncFunction";
        if (isAsync) actual = await fn(t.input);
        else { actual = fn(t.input); if (actual && typeof actual.then === "function") actual = await actual; }
        if (JSON.stringify(actual) === JSON.stringify(t.expected)) { results.push({ name: name, passed: true, executionTime: performance.now()-tStart }); passedCount++; }
        else results.push({ name: name, passed: false, error: "Got " + JSON.stringify(actual), executionTime: performance.now()-tStart });
      } catch(err) {
        results.push({ name: name, passed: false, error: err && err.message ? err.message : String(err) });
      }
    }
    clearTimeout(timer);
    if (!timedOut) self.postMessage({ type: "result", success: passedCount === msg.tests.length, results: results, consoleOutput: consoleOutput, totalTime: performance.now()-start, passedCount: passedCount, totalCount: msg.tests.length });
  } catch(err) {
    clearTimeout(timer);
    self.postMessage({ type: "result", success: false, results: [], consoleOutput: consoleOutput, error: err && err.message ? err.message : String(err), totalTime: performance.now()-start, passedCount: 0, totalCount: msg.tests.length });
  } finally { console.log = originalLog; }
};
`;
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    const killTimer = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve({ success: false, results: [], consoleOutput: [], error: "Worker terminated", totalTime: timeoutMs, passedCount: 0, totalCount: tests.length });
    }, timeoutMs + 500);
    worker.onmessage = (e) => {
      clearTimeout(killTimer);
      worker.terminate();
      URL.revokeObjectURL(url);
      const data = e.data;
      resolve({
        success: !!data.success,
        results: data.results || [],
        consoleOutput: data.consoleOutput || [],
        error: data.error,
        totalTime: data.totalTime || 0,
        passedCount: data.passedCount || 0,
        totalCount: data.totalCount || tests.length,
      });
    };
    worker.onerror = (err) => {
      clearTimeout(killTimer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve({ success: false, results: [], consoleOutput: [], error: err.message || "Worker error", totalTime: 0, passedCount: 0, totalCount: tests.length });
    };
    worker.postMessage({ type: "run", code, tests: tests.map(t => ({ name: t.name, input: t.input, expected: t.expected })), timeoutMs });
  });
}
