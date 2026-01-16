export default function decorate(block) {
  // Filter out field value children (true/false, h1-h6 text)
  const children = [...block.children].filter((child) => {
    const text = child.textContent.trim();
    return text !== 'true' && text !== 'false' && !['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(text);
  });

  const [quoteWrapper, authorWrapper] = children;

  // Check if quote should be rendered as heading
  const showAsHeading = block.classList.contains('show-as-heading');
  const headingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  // Check for heading type in multiple possible class patterns
  let headingType = 'h2'; // default
  headingTypes.forEach((type) => {
    // Check various class patterns that AEM might generate
    if (block.classList.contains(`show-as-heading-type-${type}`)
        || block.classList.contains(type)
        || block.classList.contains(`heading-type-${type}`)) {
      headingType = type;
    }
  });

  if (showAsHeading) {
    // Render as heading
    const heading = document.createElement(headingType);
    heading.textContent = quoteWrapper.textContent.trim();
    quoteWrapper.replaceChildren(heading);
  } else {
    // Render as blockquote
    const blockquote = document.createElement('blockquote');
    blockquote.textContent = quoteWrapper.textContent.trim();
    quoteWrapper.replaceChildren(blockquote);
  }

  // Handle author if present
  if (authorWrapper) {
    const author = document.createElement('p');
    author.className = 'quote-author';
    author.textContent = authorWrapper.textContent.trim();
    authorWrapper.replaceChildren(author);
  }

  // Remove field value divs from DOM
  [...block.children].forEach((child) => {
    const text = child.textContent.trim();
    if (text === 'true' || text === 'false' || ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(text)) {
      child.remove();
    }
  });
}
