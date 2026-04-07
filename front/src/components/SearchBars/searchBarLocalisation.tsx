import { useState } from 'react';
import { useLocalisations } from "../../hooks/useLocalisations";

type Props = {
  onSelect: (localisation: { id: number; label: string }) => void;
};

export default function SearchBarLocalisation({ onSelect }: Props) {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { data: allLocalisations, status } = useLocalisations();

  const filteredLocalisations = allLocalisations?.filter((localisation) => {
    const search = searchText.toLowerCase();
    return localisation.label?.toLowerCase().includes(search);
  }) || [];

  const handleSelect = (localisation: { id: number; label: string }) => {
    onSelect(localisation);
    setSearchText(localisation.label);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder={status === 'pending' ? 'Chargement…' : "Rechercher une localisation"}
        value={searchText}
        disabled={status === 'pending'}
        onClick={() => setShowResults(true)}
        onChange={(e) => { setSearchText(e.target.value); setShowResults(true); }}
        onBlur={() => { setTimeout(() => setShowResults(false), 150); }}
        className="w-full p-1 border border-gray-400 rounded bg-white text-black focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
      />

      {showResults && (allLocalisations?.length ?? 0) > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
          {(searchText ? filteredLocalisations : allLocalisations)?.map((localisation) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <linter capricieux>
            <li
              key={localisation.id}
              onClick={() => handleSelect(localisation)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {localisation.label}
            </li>
          ))}
          {searchText && filteredLocalisations.length === 0 && (
            <li className="p-2 text-gray-500">Aucune localisation trouvée</li>
          )}
        </ul>
      )}
    </div>
  );
};
