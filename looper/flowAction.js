const flow = (...fns) => fns.reduceRight((f, g) => (...args) => f(g(...args)));

const flowAction = (...actions) => actions.reduceRight(
  (f, g) => (state, other) => () => f(g(state,other)(), other)()
);

module.exports = flowAction;
