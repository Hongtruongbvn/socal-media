import React, { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import api from "../../../services/api";
import "./CoverEditButton.scss";

type Props = {
  groupId: string;
  onUploaded?: (newCoverImage: string) => void;
};

export default function CoverEditButton({ groupId, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const pickFile = () => inputRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post(`/groups/${groupId}/cover-image`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.data?.coverImage as string;
      if (url) onUploaded?.(url);
    } catch (err) {
      console.error(err);
      alert("Tải ảnh thất bại. Thử lại nhé!");
    } finally {
      setLoading(false);
      if (e.target) e.target.value = "";
    }
  };

  return (
    <>
      <button
        type="button"
        className="cover-edit-btn"
        onClick={pickFile}
        disabled={loading}
        aria-label="Chỉnh sửa ảnh bìa"
        title="Chỉnh sửa ảnh bìa"
      >
        <FaCamera style={{ marginRight: 6 }} />
        {loading ? "Đang tải..." : "Chỉnh sửa"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onFile}
      />
    </>
  );
}