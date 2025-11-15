import { X } from "lucide-react";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const addTag = (tag: string) => {
    if (!tag) return;

    // Prevent duplicates (case-insensitive but preserves display)
    const exists = tags.some((t) => t.toLowerCase() === tag.toLowerCase());
    if (exists) return;

    onTagsChange([...tags, tag]);
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter((t) => t !== tag));
  };

  return (
    <div
      className="
        peer block w-full appearance-none rounded-t-lg 
        border-0 border-b-2 border-neutral-300 
        bg-neutral-50 px-2.5 pb-2.5 pt-5 
        text-sm text-neutral-900 
        focus:border-blue-600 focus:outline-none focus:ring-0 
        dark:border-neutral-600 dark:bg-neutral-900 dark:text-white 
        dark:focus:border-blue-500
      "
    >
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="bg-neutral-200 dark:bg-neutral-700 rounded-md px-2 py-1 flex items-center"
          >
            <span>{tag}</span>

            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`remove ${tag}`}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-transparent outline-none p-2 min-w-[120px]"
        />
      </div>
    </div>
  );
};

export default TagInput;
