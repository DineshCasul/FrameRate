"use client";

import { useActionState, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { saveReview, deleteReview, type SaveReviewState } from "./actions";
import { Switch } from "@/components/ui/switch";
import Card from "@/app/components/Card";
import ReviewDetailContent from "@/app/components/ReviewDetail";
import TagPicker from "./TagPicker";
import ImageUploadField from "./ImageUploadField";
import { aspectFieldsFor, linesToArray, slugify, cardBlurb, RECOMMENDATION_BADGES } from "@/lib/utils";
import type { Review, ReviewKind } from "@/types";

type Props = {
  initialReview?: Review;
  availableTags?: string[];
  availablePlatforms?: string[];
  availableRecommendedFor?: string[];
  // Prefill for a brand-new review (e.g. from the Discover page's
  // "+ Review this" links) — ignored once initialReview is set (editing).
  defaultTitle?: string;
  defaultType?: ReviewKind;
};

type Values = {
  title: string;
  slug: string;
  type: ReviewKind;
  status: "draft" | "published";
  rating: string;
  aspects: Record<string, string>;
  coverUrl: string;
  backgroundUrl: string;
  trailerUrl: string;
  summary: string;
  content: string;
  verdict: string;
  tags: string[];
  pros: string;
  cons: string;
  platform: string[];
  recommendedFor: string[];
  playtime: string;
  recommendationBadge: string;
};

function toValues(review?: Review, defaults?: { title?: string; type?: ReviewKind }): Values {
  const aspects: Record<string, string> = {};
  for (const [key, value] of Object.entries(review?.aspectRatings ?? {})) {
    if (value !== undefined) aspects[key] = String(value);
  }
  return {
    title: review?.title ?? defaults?.title ?? "",
    slug: review?.slug ?? "",
    type: review?.type ?? defaults?.type ?? "movie",
    status: review?.status ?? "draft",
    rating: review?.rating !== undefined ? String(review.rating) : "",
    aspects,
    coverUrl: review?.coverUrl ?? "",
    backgroundUrl: review?.backgroundUrl ?? "",
    trailerUrl: review?.trailerUrl ?? "",
    summary: review?.summary ?? "",
    content: Array.isArray(review?.content) ? review.content.join("\n") : (review?.content ?? ""),
    verdict: review?.verdict ?? "",
    tags: review?.tags ?? [],
    pros: (review?.pros ?? []).join("\n"),
    cons: (review?.cons ?? []).join("\n"),
    platform: review?.platform ?? [],
    recommendedFor: review?.recommendedFor ?? [],
    playtime: review?.playtime ?? "",
    recommendationBadge: review?.recommendationBadge ?? "",
  };
}

const inputClass =
  "w-full border rounded px-3 py-2 bg-transparent text-sm sm:text-base";
const labelClass = "block text-sm font-semibold mb-1";
const sectionClass = "border-b pb-6 mb-6 last:border-b-0";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className={labelClass}>
        {label}
        {hint && <span className="font-normal text-muted-foreground"> — {hint}</span>}
      </label>
      {children}
    </div>
  );
}

export default function ReviewForm({
  initialReview,
  availableTags = [],
  availablePlatforms = [],
  availableRecommendedFor = [],
  defaultTitle,
  defaultType,
}: Props) {
  const [values, setValues] = useState<Values>(() =>
    toValues(initialReview, { title: defaultTitle, type: defaultType }),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const initialState: SaveReviewState = { error: null };
  const [state, formAction, isPending] = useActionState(saveReview, initialState);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function setAspect(aspect: string, value: string) {
    setValues((v) => ({ ...v, aspects: { ...v.aspects, [aspect]: value } }));
  }

  // deleteReview can't be a nested <form> (this component already renders
  // the save form), so it's called imperatively — still a real Server
  // Action call, just triggered from a plain button instead of form action.
  async function handleDelete() {
    if (!initialReview?.id) return;
    if (!confirm(`Delete "${initialReview.title}"? This can't be undone.`)) return;
    setIsDeleting(true);
    const fd = new FormData();
    fd.set("id", initialReview.id);
    fd.set("slug", initialReview.slug);
    const result = await deleteReview(fd);
    if (result.error) {
      setIsDeleting(false);
      alert(`Failed to delete: ${result.error}`);
    }
  }

  const computedSlug = slugify(values.slug || values.title) || "—";
  const aspects = aspectFieldsFor(values.type);

  const previewReview: Review = useMemo(() => {
    const aspectRatings: NonNullable<Review["aspectRatings"]> = {};
    for (const aspect of aspects) {
      const raw = values.aspects[aspect];
      const n = raw !== undefined && raw !== "" ? Number(raw) : undefined;
      if (n !== undefined && Number.isFinite(n)) {
        (aspectRatings as Record<string, number>)[aspect] = n;
      }
    }
    return {
      id: initialReview?.id ?? "preview",
      slug: computedSlug,
      title: values.title || "Untitled",
      type: values.type,
      rating: Number(values.rating) || 0,
      aspectRatings: Object.keys(aspectRatings).length ? aspectRatings : undefined,
      tags: values.tags,
      publishedAt: initialReview?.publishedAt ?? "",
      trailerUrl: values.trailerUrl || undefined,
      backgroundUrl: values.backgroundUrl || undefined,
      coverUrl: values.coverUrl || undefined,
      summary: values.summary,
      content: values.content,
      pros: linesToArray(values.pros),
      cons: linesToArray(values.cons),
      verdict: values.verdict,
      playtime: values.playtime || undefined,
      platform: values.platform,
      recommendedFor: values.recommendedFor,
      recommendationBadge: values.recommendationBadge || undefined,
      status: values.status,
    };
  }, [values, aspects, computedSlug, initialReview]);

  return (
    <form action={formAction} className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-start">
      {initialReview?.id && <input type="hidden" name="id" value={initialReview.id} />}

      {/* Left: the actual fields */}
      <div>
        <section className={`${sectionClass} animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both`}>
          <h2 className="text-lg sm:text-xl font-bold mb-4">Basics</h2>
          <Field label="Title">
            <input
              className={inputClass}
              name="title"
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </Field>
          <Field label="Slug" hint={`auto: /reviews/${computedSlug}`}>
            <input
              className={inputClass}
              name="slug"
              placeholder={slugify(values.title)}
              value={values.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <select
                className={inputClass}
                name="type"
                value={values.type}
                onChange={(e) => {
                  const nextType = e.target.value as ReviewKind;
                  setValues((v) => ({
                    ...v,
                    type: nextType,
                    // Badge phrases are per-type — carrying one over across a
                    // type switch would show e.g. "Worth a Rental" on a movie.
                    recommendationBadge: RECOMMENDATION_BADGES[nextType].includes(
                      v.recommendationBadge,
                    )
                      ? v.recommendationBadge
                      : "",
                  }));
                }}
              >
                <option value="movie">Movie</option>
                <option value="game">Game</option>
                <option value="series">Series</option>
              </select>
            </Field>
            <Field label="Status">
              <div className="flex items-center gap-3 h-[42px]">
                <Switch
                  name="status"
                  value="published"
                  checked={values.status === "published"}
                  onCheckedChange={(checked) => set("status", checked ? "published" : "draft")}
                />
                <span className="text-sm">
                  {values.status === "published" ? "Published" : "Draft"}
                </span>
              </div>
            </Field>
          </div>
          <Field label="Recommendation badge" hint="optional, shown as a small pill on the card">
            <div className="flex flex-wrap gap-2">
              {RECOMMENDATION_BADGES[values.type].map((badge) => {
                const selected = values.recommendationBadge === badge;
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => set("recommendationBadge", selected ? "" : badge)}
                    aria-pressed={selected}
                    className={`px-2.5 py-1 rounded-full text-xs sm:text-sm border transition ${
                      selected ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"
                    }`}
                  >
                    {badge}
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="recommendationBadge" value={values.recommendationBadge} />
          </Field>
        </section>

        <section className={`${sectionClass} animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75 fill-mode-both`}>
          <h2 className="text-lg sm:text-xl font-bold mb-4">Media</h2>
          <ImageUploadField
            label="Cover image"
            name="coverUrl"
            value={values.coverUrl}
            onChange={(url) => set("coverUrl", url)}
          />
          <ImageUploadField
            label="Background image"
            name="backgroundUrl"
            value={values.backgroundUrl}
            onChange={(url) => set("backgroundUrl", url)}
          />
          <Field label="Trailer URL" hint="YouTube link">
            <input
              className={inputClass}
              name="trailerUrl"
              value={values.trailerUrl}
              onChange={(e) => set("trailerUrl", e.target.value)}
            />
          </Field>
        </section>

        <section className={`${sectionClass} animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both`}>
          <h2 className="text-lg sm:text-xl font-bold mb-4">Ratings</h2>
          <Field label="Overall rating" hint="0–10">
            <input
              className={inputClass}
              name="rating"
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={values.rating}
              onChange={(e) => set("rating", e.target.value)}
              required
            />
          </Field>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {aspects.map((aspect) => (
              <Field key={aspect} label={aspect.replace(/([A-Z])/g, " $1")}>
                <input
                  className={inputClass}
                  name={`aspect_${aspect}`}
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={values.aspects[aspect] ?? ""}
                  onChange={(e) => setAspect(aspect, e.target.value)}
                />
              </Field>
            ))}
          </div>
          {values.type === "game" && (
            <Field label="Playtime" hint='e.g. "45 hours"'>
              <input
                className={inputClass}
                name="playtime"
                value={values.playtime}
                onChange={(e) => set("playtime", e.target.value)}
              />
            </Field>
          )}
        </section>

        <section className={`${sectionClass} animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both`}>
          <h2 className="text-lg sm:text-xl font-bold mb-4">Writing</h2>
          <Field label="Summary" hint="short, shown as a TLDR">
            <textarea
              className={inputClass}
              name="summary"
              rows={2}
              value={values.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </Field>
          <Field label="Content" hint="one paragraph per line">
            <textarea
              className={inputClass}
              name="content"
              rows={8}
              value={values.content}
              onChange={(e) => set("content", e.target.value)}
            />
          </Field>
          <Field label="Verdict">
            <textarea
              className={inputClass}
              name="verdict"
              rows={2}
              value={values.verdict}
              onChange={(e) => set("verdict", e.target.value)}
            />
          </Field>
        </section>

        <section className={`${sectionClass} animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both`}>
          <h2 className="text-lg sm:text-xl font-bold mb-4">Lists</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            Tags, platforms, and recommended-for: pick from existing values or add your own.
            Pros/cons are one item per line.
          </p>
          <TagPicker
            name="tags"
            label="Tags"
            options={availableTags}
            value={values.tags}
            onChange={(next) => set("tags", next)}
            placeholder="Add a tag…"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Pros">
              <textarea
                className={inputClass}
                name="pros"
                rows={4}
                value={values.pros}
                onChange={(e) => set("pros", e.target.value)}
              />
            </Field>
            <Field label="Cons">
              <textarea
                className={inputClass}
                name="cons"
                rows={4}
                value={values.cons}
                onChange={(e) => set("cons", e.target.value)}
              />
            </Field>
          </div>
          <TagPicker
            name="platform"
            label="Platforms"
            options={availablePlatforms}
            value={values.platform}
            onChange={(next) => set("platform", next)}
            placeholder="Add a platform…"
          />
          <TagPicker
            name="recommendedFor"
            label="Recommended for"
            options={availableRecommendedFor}
            value={values.recommendedFor}
            onChange={(next) => set("recommendedFor", next)}
            placeholder="Add an audience…"
          />
        </section>

        {state.error && (
          <p className="text-red-600 dark:text-red-400 text-sm mb-4">{state.error}</p>
        )}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="border rounded px-4 py-2 hover:bg-muted transition disabled:opacity-50 cursor-pointer font-semibold"
          >
            {isPending ? "Saving..." : initialReview ? "Save Changes" : "Create Review"}
          </button>
          <Link href="/admin" className="text-sm underline hover:no-underline">
            Cancel
          </Link>
          {initialReview && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm text-status-bad hover:underline disabled:opacity-50 cursor-pointer ml-auto"
            >
              {isDeleting ? "Deleting..." : "Delete review"}
            </button>
          )}
        </div>
      </div>

      {/* Right: live preview, same components the site renders in production */}
      <div className="lg:sticky lg:top-4 animate-in fade-in duration-700 delay-150 fill-mode-both">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Live Preview</h2>
        <div className="mb-6">
          <Card
            title={previewReview.title}
            rating={previewReview.rating}
            blurb={cardBlurb(previewReview)}
            type={previewReview.type}
            backgroundUrl={previewReview.backgroundUrl}
            recommendationBadge={previewReview.recommendationBadge}
          />
        </div>
        <div className="border rounded p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          <ReviewDetailContent review={previewReview} linkTags={false} />
        </div>
      </div>
    </form>
  );
}
