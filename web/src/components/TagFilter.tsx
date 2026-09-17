type Props = {
  tags: string[];
  activeTag: string | undefined;
  onSelect: (tag: string | undefined) => void;
};

const BASE = "rounded-md border px-2.5 py-1 text-sm";
const INACTIVE = `${BASE} border-gray-300 bg-white hover:bg-gray-100`;
const ACTIVE = `${BASE} border-gray-900 bg-gray-900 text-white`;

export function TagFilter({ tags, activeTag, onSelect }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <button
        type="button"
        onClick={() => onSelect(undefined)}
        className={activeTag === undefined ? ACTIVE : INACTIVE}
      >
        すべて
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelect(tag)}
          className={activeTag === tag ? ACTIVE : INACTIVE}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
