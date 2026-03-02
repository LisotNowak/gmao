import { useState } from 'react';
import { useType } from '../../hooks/useType';

type Props = {
  onSelect: (typeId: number) => void;
};

export default function SearchBarType({ onSelect }: Props) {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { data: allTypes, error, status } = useType();

  const filteredTypes = allTypes?.filter((type) => {
    const search = searchText.toLowerCase();
    // protect against null type or missing label
    return type?.label?.toLowerCase().includes(search);
  }) || [];

  const handleSelect = (type: { id: number; label: string }) => {
    onSelect(type.id);
    setSearchText(type.label);
    setShowResults(false);
  };

  return (
    <>
      {status === 'pending' && <div>Chargement...</div>}
      {status === 'error' && <div>Erreur : {error.message}</div>}
      {status === 'success' && (
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Sélectionner un domaine d'intervention"
            value={searchText}
            onClick={() => setShowResults(true)} 
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowResults(true);
              
            }}
            onBlur={() => {
              setTimeout(() => setShowResults(false), 150); 
            }}
            className="w-full p-1 border border-gray-400 rounded bg-white text-black focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
          />

          {showResults && (
            <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
              {(searchText ? filteredTypes : allTypes)?.map((type) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <linter capricieux>
                <li
                  key={type?.id}
                  onClick={() => type && handleSelect(type)}
                  className="p-2 hover:bg-gray-100 cursor-pointer" >                 
                  {type?.label ?? ''}
                </li>                
              ))}
              {(searchText && filteredTypes.length === 0) && (
                <li className="p-2 text-gray-500">Aucune localisation trouvée</li>
              )}
            </ul>
          )}
        </div>
      )}
    </>
  );
};
