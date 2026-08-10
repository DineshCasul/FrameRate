"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { aspectFieldsFor, linesToArray, slugify, toSnakeCase } from "@/lib/utils";
import type { ReviewKind } from "@/types";

export type SaveReviewState = { error: string | null };

function toNumber(value: FormDataEntryValue | null): number | undefined {
  if (value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function toText(value: FormDataEntryValue | null): string | undefined {
  const s = String(value ?? "").trim();
  return s || undefined;
}

export async function saveReview(
  _prevState: SaveReviewState,
  formData: FormData,
): Promise<SaveReviewState> {
  const id = toText(formData.get("id"));
  const title = toText(formData.get("title"));
  const type = toText(formData.get("type")) as ReviewKind | undefined;
  const rating = toNumber(formData.get("rating"));

  if (!title) return { error: "Title is required." };
  if (!type) return { error: "Type is required." };
  if (rating === undefined) return { error: "Rating is required." };

  const slugOverride = toText(formData.get("slug"));
  const slug = slugify(slugOverride ?? title);
  if (!slug) return { error: "Slug could not be generated — check the title." };

  const aspectRatings: Record<string, number> = {};
  for (const aspect of aspectFieldsFor(type)) {
    const value = toNumber(formData.get(`aspect_${aspect}`));
    if (value !== undefined) aspectRatings[aspect] = value;
  }

  const fields = {
    title,
    slug,
    type,
    status: formData.get("status") === "published" ? "published" : "draft",
    rating,
    aspectRatings: Object.keys(aspectRatings).length ? aspectRatings : null,
    tags: linesToArray(formData.get("tags")),
    coverUrl: toText(formData.get("coverUrl")) ?? null,
    backgroundUrl: toText(formData.get("backgroundUrl")) ?? null,
    trailerUrl: toText(formData.get("trailerUrl")) ?? null,
    summary: toText(formData.get("summary")) ?? "",
    // Plain newline-delimited string, not string[] — parseContent() in
    // lib/utils.ts already splits this on read, one line per paragraph.
    content: String(formData.get("content") ?? "").trim(),
    verdict: toText(formData.get("verdict")) ?? "",
    pros: linesToArray(formData.get("pros")),
    cons: linesToArray(formData.get("cons")),
    playtime: toText(formData.get("playtime")) ?? null,
    platform: linesToArray(formData.get("platform")),
    recommendedFor: linesToArray(formData.get("recommendedFor")),
    recommendationBadge: toText(formData.get("recommendationBadge")) ?? null,
  };

  const row = toSnakeCase(fields);
  const supabaseAdmin = getSupabaseAdmin();

  const { error } = id
    ? await supabaseAdmin.from("reviews").update(row).eq("id", id)
    : await supabaseAdmin
        .from("reviews")
        .insert({ ...row, published_at: new Date().toISOString() });

  if (error) {
    // Postgres unique-violation — almost always the slug colliding with an
    // existing review, which is far more actionable than the raw message.
    if (error.code === "23505") {
      return {
        error: `A review with the slug "${slug}" already exists — try a different slug.`,
      };
    }
    return { error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/reviews");
  revalidatePath("/");
  revalidatePath("/recommend");
  revalidatePath(`/reviews/${slug}`);

  redirect("/admin");
}

const IMAGE_BUCKET = "review-images";
let bucketReady = false;

// Lazily creates the storage bucket on first upload instead of requiring a
// manual dashboard setup step — idempotent, cached per server process.
async function ensureImageBucket() {
  if (bucketReady) return;
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.storage.listBuckets();
  if (!data?.some((b) => b.name === IMAGE_BUCKET)) {
    await supabaseAdmin.storage.createBucket(IMAGE_BUCKET, { public: true });
  }
  bucketReady = true;
}

export type UploadImageResult = { url?: string; error?: string };

export async function uploadImage(formData: FormData): Promise<UploadImageResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files are allowed." };
  }

  await ensureImageBucket();
  const supabaseAdmin = getSupabaseAdmin();

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `${randomUUID()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const { data } = supabaseAdmin.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function deleteReview(formData: FormData): Promise<{ error?: string }> {
  const id = toText(formData.get("id"));
  const slug = toText(formData.get("slug"));
  if (!id) return {};

  const { error } = await getSupabaseAdmin().from("reviews").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/reviews");
  revalidatePath("/");
  revalidatePath("/recommend");
  if (slug) revalidatePath(`/reviews/${slug}`);

  redirect("/admin");
}
