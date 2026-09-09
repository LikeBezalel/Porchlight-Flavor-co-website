export default function Stars({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= rating ? "text-[var(--color-gold)]" : "text-[var(--color-parchment)]"}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}
