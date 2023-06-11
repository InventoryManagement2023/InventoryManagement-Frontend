import {FC, useEffect, useState} from 'react';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import ExportForm from 'components/forms/ExportForm';
import {Alert, Container, Stack} from '@mui/material';
import {Add} from '@mui/icons-material';
import CustomButton from 'components/form-fields/CustomButton';
import ErrorInformation from 'components/layout/ErrorInformation';
import {ICategory, IDepartment, ILocation, IPrinter, ISupplier, IType} from 'components/interfaces';

const Export: FC = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState('');
    const [type, setType] = useState<IType[] | JSON | null>([]);
    const [department, setDepartment] = useState<IDepartment[] | JSON | null>([]);
    const [location, setLocation] = useState<ILocation[] | JSON | null>([]);
    const [supplier, setSupplier] = useState<ISupplier[] | JSON | null>([]);
    const [printer, setPrinter] = useState<IPrinter[] | JSON | null>([]);
    const [category, setCategory] = useState<ICategory[] | JSON | null>([]);

    const fetchData = async (typeToFetch: string, setMethod: (res: JSON) => void) => {
        await fetch(`${process.env.HOSTNAME}/api/inventorymanagement/${typeToFetch}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then((response) => {
            if (response.ok) {
                response.json().then((res) => setMethod(res));
            }
        });
    };

    useEffect(() => {
        fetchData('type', setType).catch(() => setError(true));
        fetchData('department', setDepartment).catch(() => setError(true));
        fetchData('location', setLocation).catch(() => setError(true));
        fetchData('supplier', setSupplier).catch(() => setError(true));
        fetchData('printer', setPrinter).catch(() => setError(true));
        fetchData('category', setCategory).catch(() => setError(true));
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
        return <ErrorInformation></ErrorInformation>;
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
                    label="Exportieren"
                    onClick={() => setFormError('')}
                    symbol={<Add/>}
                />
            </Container>
        );
    } else {
        return (
            <Container sx={{mt: 12, mb: 8}}>
                <ExportForm
                    category={category as ICategory[]}
                    printer={printer as IPrinter[]}
                    department={department as IDepartment[]}
                    type={type as IType[]}
                    location={location as ILocation[]}
                    status={status}
                    supplier={supplier as ISupplier[]}
                    initialCreation={true}
                    disabled={loading}
                />

            </Container>
        );
    }
};

export default Export;
