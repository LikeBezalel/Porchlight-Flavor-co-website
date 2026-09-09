import Stars from "./Stars";

export type Testimonial = {
  id: string;
  name: string;
  location: string | null;
  rating: number | null;
  quote: string;
  approved?: boolean;
  created_at?: string;
};

export default function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="bg-[var(--color-warm-white)] border border-[var(--color-parchment)] rounded-2xl p-6 flex flex-col gap-3 h-full">
      <Stars rating={t.rating} />
      <blockquote
        className="text-[var(--color-brown)] leading-relaxed flex-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="text-sm">
        <span className="font-semibold text-[var(--color-brown)]">{t.name}</span>
        {t.location && (
          <span className="text-[var(--color-brown-muted)]"> · {t.location}</span>
        )}
      </figcaption>
    </figure>
  );
}
