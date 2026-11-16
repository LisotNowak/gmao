// components/JoinInterventionForm.tsx
import type React from 'react';
import { useEffect, useState } from 'react';
import { useStoreMaterials } from '../../hooks/useMaterials';
import type { IStoreMaterial } from '../../types/Imaterial';
import SearchBarConsumable from '../SearchBars/searchBarConsumable';
import SearchBarStore from '../SearchBars/searchBarStore';

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (materialId: number, quantity: number) => void;
  consumable?: boolean;
};

const StockInForm: React.FC<Props> = ({ show, onClose, onSubmit, consumable = false }) => {

    const { data: storeMaterial = [] } = useStoreMaterials(); 
    const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
    const [quantityToAdd, setQuantityToAdd] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (show) {
        setSelectedMaterialId(null);
        setQuantityToAdd(0);
        setIsSubmitting(false);
      }
    }, [show]);

    const selectedMaterial: IStoreMaterial | undefined = storeMaterial.find(
      (mat) => mat.id === selectedMaterialId
    );

    const handleSubmit = () => {
      if (isSubmitting) return;
      if (
        selectedMaterial &&
        quantityToAdd > 0       
      ) {
        onSubmit(selectedMaterial.id, quantityToAdd);
        console.log(selectedMaterial)
      } else {
        alert(`Veuillez sélectionner ${consumable ? "un consommable" : "un article"} et une quantité valide`);
      }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg w-1/3 border-3">
              <form action="" className='w-full ' onSubmit={(e) => e.preventDefault()}>
                  <label htmlFor="material">
                    <div className='flex flex-col items-center gap-2'>
                      <div className=' w-1/2'>
                        {consumable ? (
                          <SearchBarConsumable includeToOrder onSelect={(materialId: number) => {
                              setSelectedMaterialId(materialId);
                          }} />
                        ) : (
                          <SearchBarStore onSelect={(materialId: number) => {
                              setSelectedMaterialId(materialId);
                          }} />
                        )}
                      </div>

                    {selectedMaterial && (
                      <p className="text-black">
                        Stock actuel : <span className="font-bold">{selectedMaterial.quantity ?? 0}</span>
                      </p>
                    )}

                    <input
                      type="number"
                      className="input validator w-1/2 bg-white text-black border-black border-2 rounded-xl border-gray-600"
                      required
                      placeholder="Quantité"
                      value={quantityToAdd}
                      onChange={(e) => setQuantityToAdd(Number(e.target.value))}                                         
                      />                    
                      <div className="flex justify-center gap-2">
                        <button type= "button" className="btn btn-error" onClick={onClose}>Annuler</button>
                        <button type= "button" className="btn btn-success" onClick={handleSubmit}> Valider </button>
                      </div>
                    </div>
                </label>                
            </form>
        </div>
      </div>        
    );    
};

export default StockInForm;
