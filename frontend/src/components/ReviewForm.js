import { useState } from 'react';

function ReviewForm({ onSubmit, initialText = '', buttonLabel = 'Submit Review' }) {
  const [text, setText] = useState(initialText);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length < 10) return;
    onSubmit(text.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your review (at least 10 characters)..."
      />
      <button type="submit" className="btn btn-primary" disabled={text.trim().length < 10}>
        {buttonLabel}
      </button>
    </form>
  );
}

export default ReviewForm;
