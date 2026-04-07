import { useState } from 'react';
import { usePriority } from "../../hooks/usePriority";

type Props = {
  onSelect: (priorityId: number) => void;
};

export default function SearchBarPriority({ onSelect }: Props) {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { data: allPriorities, status } = usePriority();

  const filteredPriorities = allPriorities?.filter((priority) => {
    const search = searchText.toLowerCase();
    return priority.label?.toLowerCase().includes(search);
  }) || [];

  const handleSelect = (priority: { id: number; label: string }) => {
    onSelect(priority.id);
    setSearchText(priority.label);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder={status === 'pending' ? 'Chargement…' : "Sélectionner une priorité"}
        value={searchText}
        disabled={status === 'pending'}
        onClick={() => setShowResults(true)}
        onChange={(e) => { setSearchText(e.target.value); setShowResults(true); }}
        onBlur={() => { setTimeout(() => setShowResults(false), 150); }}
        className="w-full p-1 border border-gray-400 rounded bg-white text-black focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
      />

      {showResults && (allPriorities?.length ?? 0) > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
          {(searchText ? filteredPriorities : allPriorities)?.map((priority) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <linter capricieux>
            <li
              key={priority.id}
              onClick={() => handleSelect(priority)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {priority.label}
            </li>
          ))}
          {searchText && filteredPriorities.length === 0 && (
            <li className="p-2 text-gray-500">Aucune priorité trouvée</li>
          )}
        </ul>
      )}
    </div>
  );
};
