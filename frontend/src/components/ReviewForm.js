import { useState } from 'react';

function ReviewForm({ onSubmit, initialText = '', buttonLabel = 'Submit Review', onCancel }) {
  const [text, setText] = useState(initialText);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length < 10) return;
    onSubmit(text.trim());
  };

  const handleCancel = () => {
    setText(initialText);
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your review (at least 10 characters)..."
      />
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button type="submit" className="btn btn-primary" disabled={text.trim().length < 10}>
          {buttonLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;
