import { mdiHomeCircleOutline, mdiMenu } from '@mdi/js';
import Icon from "@mdi/react";
import { Link, useParams } from "react-router";

function Header (){

   const {serviceLabel} = useParams();

    return(
       <section className="w-full flex justify-between items-center">
         <div className=" btn bg-white border-none shadow-none text-black rounded-field p-5 hover:text-white ">
            <Link to={`/accueil/${serviceLabel}`} className=''>
               <Icon path={mdiHomeCircleOutline} size={2} className='hover:text-white hover:bg-black hover:rounded-full' />
            </Link>            
         </div>

         <div className="text-black p-5 flex justify-center">
            <div className="dropdown dropdown-end">
            {/** biome-ignore lint/a11y/useSemanticElements: <Linter capricieux> */}
               <div tabIndex={0} role="button" className="btn bg-white text-black border-none shadow-none rounded-field">
                  <Icon path={mdiMenu} size={2} className='hover:text-white hover:bg-black hover:rounded-full' />
               </div>

               <ul
                  className="menu dropdown-content  w-52 rounded-box bg-white border border-gray-200 shadow-lg z-50 font-bold">
                  <li className='hover:bg-gray-200 rounded'>
                  <Link to={`/demandes/${serviceLabel}`} aria-label="Lien vers la page demandes d'interventions">Demandes d'intervention</Link>
                  </li>
                  <li className='hover:bg-gray-200 rounded'>
                  <Link to={`/encours/${serviceLabel}`} aria-label="Lien vers la page interventions en cours">Interventions en cours</Link>
                  </li>
                  <li className='hover:bg-gray-200 rounded'>
                  <Link to={`/preventifs/${serviceLabel}`} aria-label="Lien vers la page préventives">Préventif</Link>
                  </li>
                  <li className='hover:bg-gray-200 rounded'>
                  <Link to={`/materiel/${serviceLabel}`} aria-label="Lien vers la page matériel">Matériel</Link>
                  </li>
                  {serviceLabel === "atelier" ? <li className='hover:bg-gray-200 rounded'>
                  <Link to={`/magasin/${serviceLabel}`} aria-label="Lien vers la page magasin">Magasin</Link>
                  </li> : ""}               
                  {/* <li className='hover:bg-gray-200 rounded'>
                  <Link to="/" aria-label="Lien vers la page analyses">Analyses</Link>
                  </li>
                  <li className='hover:bg-gray-200 rounded'>
                  <Link to="/" aria-label="Lien vers la page historique">Historique</Link>
                  </li>                   */}
               </ul>
            </div>
         </div>
       </section>
    );
};
export default Header;


