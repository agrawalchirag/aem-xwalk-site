import { getPlaceholder } from '../../scripts/placeholders.js';

export default async function decorate(block) {
  const [quoteWrapper, authorWrapper] = block.children;

  if (!quoteWrapper) return;

  // Check if quote should be rendered as heading
  const showAsHeading = block.classList.contains('show-as-heading');
  const headingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  // Find selected heading type from classes, default to h5
  let headingType = 'h5';
  headingTypes.forEach((type) => {
    if (block.classList.contains(`show-as-heading-type-${type}`)) {
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

  // Add "Quote of the day" suffix from placeholders
  const quoteOfTheDayText = await getPlaceholder('quote-of-the-day');
  if (quoteOfTheDayText) {
    const suffix = document.createElement('p');
    suffix.className = 'quote-suffix';
    suffix.textContent = quoteOfTheDayText;
    block.appendChild(suffix);
  }
}
