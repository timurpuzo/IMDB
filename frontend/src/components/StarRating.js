import { useState } from 'react';

function StarRating({ value = 0, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || value) ? 'filled' : ''}`}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      ))}
      {value > 0 && <span style={{ marginLeft: 8, fontWeight: 600 }}>{value}/10</span>}
    </div>
  );
}

export default StarRating;
