/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <linter capricieux> */
import {  useState } from 'react';
import { useStoreMaterials } from "../../hooks/useMaterials";

type Props = {
  onSelect: (materialId: number) => void;
  // Inclure aussi les consommables à recommander (statut 7)
  includeToOrder?: boolean;
};

export default function SearchBarStore({ onSelect, includeToOrder = false }: Props) {

  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { data: allMaterialsStore, error, status } = useStoreMaterials();

  const filteredConsumables = allMaterialsStore?.filter((material) => {
    const isConsumable = material.statusId === 6 || (includeToOrder && material.statusId === 7);
    if (!isConsumable) return false;
    const search = searchText.toLowerCase();
    const matchText =
        material.name?.toLowerCase().includes(search) ||
        material.brand?.toLowerCase().includes(search) ||
        material.model?.toLowerCase().includes(search);
    return matchText ;
    }) || [];   

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredConsumables.length > 0) {
      const firstMatch = filteredConsumables[0];
      onSelect(firstMatch.id);
      setSearchText(firstMatch.name);
      setShowResults(false);
    }
  };

  return (
    <>
      {status === 'pending' && <div>Chargement...</div>}
      {status === 'error' && <div>Erreur : {error.message}</div>}
      {status === 'success' && (
        <div className="search-bar bg-white relative  max-w-md ">
          <form
          onSubmit={handleSubmit}
          className="search-bar bg-white  relative w-full max-w-md"
          >
            <input
              type="text"
              placeholder="Rechercher un article"
              value={searchText}
              onChange={(e) => {setSearchText(e.target.value);
                setShowResults(true);}}
              
              className="w-full p-1 border-2 rounded-xl border-gray-600  bg-white text-black"
            />

            {searchText &&  showResults && (
              <ul className="absolute bg-white shadow-md z-50 w-full mt-1 rounded max-h-60 overflow-y-auto text-black">
                {filteredConsumables.length > 0 ? (
                  filteredConsumables.map((material) => (
                    <li
                      key={material.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); 
                        onSelect(material.id);
                        setSearchText(material.name );                        
                        setShowResults(false); 
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <strong>{material.name}</strong>
                      <div className="text-sm text-gray-500">
                        {material.brand} – {material.model}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">Aucun article trouvé</li>
                )}
              </ul>
            )}
          </form>
        </div>
      )}
    </>
  );
}
