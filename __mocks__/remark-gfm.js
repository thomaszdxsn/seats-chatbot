// Mock implementation of remark-gfm for Jest
const remarkGfm = () => {
  // Simple mock that does nothing for tests
  return (tree) => tree;
};

module.exports = remarkGfm;
module.exports.default = remarkGfm;