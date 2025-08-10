// Mock implementation of react-markdown for Jest
const React = require('react');

const ReactMarkdown = ({ children, components, remarkPlugins, ...props }) => {
  // Simple mock that just renders the markdown as plain text
  // For tests, we don't need the full markdown parsing
  // Filter out react-markdown specific props that shouldn't be passed to DOM elements
  const { className, ...domProps } = props;
  const validProps = { 'data-testid': 'markdown', className };
  
  if (typeof children === 'string') {
    return React.createElement('div', validProps, children);
  }
  return React.createElement('div', validProps, children);
};

module.exports = ReactMarkdown;
module.exports.default = ReactMarkdown;