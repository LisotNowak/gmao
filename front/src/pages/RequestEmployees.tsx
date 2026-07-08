import { useState } from "react";
import { useParams } from "react-router-dom";

import FormInterventionRequestEmployee from "../components/Forms/formRequestIntervention";

const RequestEmployees = () => {
    const { serviceLabel } = useParams();
    const [showForm, setShowForm] = useState(true);
    return(
        <main className="flex flex-col h-screen max-w-screen overflow-x-hidden bg-white">
            <div className=" w-screen justify-end">

                <FormInterventionRequestEmployee show={showForm} onClose={() => setShowForm(true)} serviceLabel={serviceLabel} />

            </div>
        </main>
    );
};

export default RequestEmployees