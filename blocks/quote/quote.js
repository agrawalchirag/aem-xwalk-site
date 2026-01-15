export default function decorate(block) {
  const [quoteWrapper, authorWrapper] = block.children;
  
  // Check if quote should be rendered as heading
  const showAsHeading = block.classList.contains('show-as-heading');
  const headingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const headingType = headingTypes.find((type) => block.classList.contains(type)) || 'h2';

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
}
