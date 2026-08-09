"use client";

import { useId, useRef, useState, type ChangeEvent } from "react";
import { uploadImage } from "./actions";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploadField({ label, name, value, onChange }: Props) {
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadImage(fd);

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";

    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.url) onChange(result.url);
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 bg-transparent text-sm sm:text-base"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or upload a file"
        />
        <input
          ref={fileRef}
          id={fileId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor={fileId}
          className="border rounded px-3 py-2 text-sm hover:bg-muted transition cursor-pointer whitespace-nowrap"
        >
          {uploading ? "Uploading..." : "Upload"}
        </label>
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>}
      {value && (
        // Arbitrary Supabase Storage / pasted URLs — same reasoning as the
        // rest of the app for not routing through next/image (Card uses a
        // plain CSS background-image for backgroundUrl too).
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-2 h-20 rounded border object-cover" />
      )}
    </div>
  );
}
