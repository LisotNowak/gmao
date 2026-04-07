/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <linter capricieux> */
import { useState } from 'react';
import { useMaterials } from "../../hooks/useMaterials";

type Props = {
  onSelect: (materialId: number) => void;
};

export default function SearchBarMaterialEmployee({ onSelect }: Props) {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { data: allMaterials, status } = useMaterials();
   
  const filteredMaterials = allMaterials?.filter((material) => {
    const search = searchText.toLowerCase();
    const matchText =
      material.name?.toLowerCase().includes(search) ||
      material.brand?.toLowerCase().includes(search) ||
      material.model?.toLowerCase().includes(search);
    return matchText ;
  }) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredMaterials.length > 0) {
      const firstMatch = filteredMaterials[0];
      onSelect(firstMatch.id);
      setSearchText(firstMatch.name);
      setShowResults(false);
    };
  };

  return (
    <div className="search-bar bg-white relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="bg-white relative w-full">
        <input
          type="text"
          placeholder={status === 'pending' ? 'Chargement…' : "Rechercher nom, marque ou modèle"}
          value={searchText}
          disabled={status === 'pending'}
          onChange={(e) => { setSearchText(e.target.value); setShowResults(true); }}
          className="w-full p-1 border border-gray-400 rounded bg-white text-black focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
        />

        {searchText && showResults && (
          <ul className="absolute bg-white shadow-md z-50 w-full mt-1 rounded max-h-60 overflow-y-auto text-black">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => (
                <li
                  key={material.id}
                  onClick={() => { onSelect(material.id); setSearchText(material.name); setShowResults(false); }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <strong>{material.name}</strong>
                  <div className="text-sm text-gray-500">{material.brand} – {material.model}</div>
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">Aucun matériel trouvé</li>
            )}
          </ul>
        )}
      </form>
    </div>
  );
};
