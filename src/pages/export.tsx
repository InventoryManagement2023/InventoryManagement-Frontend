import {FC, useEffect, useState} from 'react';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import ExportForm from 'components/forms/ExportForm';
import {Alert, Container, Stack} from '@mui/material';
import {Add} from '@mui/icons-material';
import CustomButton from 'components/form-fields/CustomButton';
import ErrorInformation from "components/layout/ErrorInformation";


const Export: FC = () => {
    //const [type, setType] = useState<IType[] | JSON | null>(null);
    // const [department] = useState<IDepartment[] | JSON | null>(null);
    const [error] = useState(false);
    //const [location, setLocation] = useState<ILocation[] | JSON | null>(null);
    //const [supplier, setSupplier] = useState<ISupplier[] | JSON | null>(null);
    //const [printer, setPrinter] = useState<IPrinter[] | JSON | null>(null);
    //const { userId, firstName, lastName, admin, superAdmin, departmentId, departmentName } = useContext(UserContext);

    const [loading, setLoading] = useState(true);
    //const [error] = useState(false);
    const [formError, setFormError] = useState('');
    /*const fetchData = async (typeToFetch: string, setMethod: (res: JSON) => void) => {
        await fetch(`${process.env.HOSTNAME}/api/inventorymanagement/${typeToFetch}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            if (response.ok) {
                response.json().then((res) => setMethod(res));
            }
        });
    };*/
    useEffect(() => {
        //fetchData('type', setType).catch(() => setError(true));
        //fetchData('department', setDepartment).catch(() => setError(true));
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <Container
                sx={{
                    mt: 12,
                    mb: 8,
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    alignItems: 'center'
                }}
            >
                <LoadingSpinner/>
            </Container>
        );
    } else if (error) {
        return (
            <ErrorInformation></ErrorInformation>
        );
    } else if (formError) {
        return (
            <Container sx={{mt: 12, mb: 8, display: 'flex', flexFlow: 'column nowrap', alignItems: 'center'}}>
                <Stack
                    sx={{
                        width: '17em',
                        marginTop: '0.8em',
                        marginBottom: '0.5em'
                    }}
                    spacing={2}
                >
                    {formError && <Alert severity="error">Es ist folgender Fehler aufgetreten: {formError}</Alert>}
                </Stack>
                <CustomButton
                    label="Neuen Gegenstand erfassen"
                    onClick={() => setFormError('')}
                    symbol={<Add/>}
                />
            </Container>
        );
    } else {


        return (
            <Container sx={{mt: 12, mb: 8}}>
                <ExportForm
                    department={[]}
                    type={[]}
                    category={[]}
                    location={[]}
                    initialCreation={true}
                    anlagedatumBis=""
                    anlagedatumVon=""
                    lieferdatumBis=""
                    lieferdatumVon=""
                    ausgabedatumBis=""
                    ausgabedatumVon=""
                    ausscheidedatumBis=""
                    ausscheidedatumVon=""
                    status = ""
                    supplier={[]}

                    //department={department as IDepartment[]}

                />
            </Container>
        );
    }
};

export default Export;
