import { FC, MouseEvent, useContext, useEffect, useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import CustomSelect from 'components/form-fields/CustomSelect';
import LoadingSpinner from 'components/layout/LoadingSpinner';
import { ICategory, IObjectToSend } from 'components/interfaces';
import ParameterForm from 'components/forms/ParameterForm';
import ParameterFormDepartment from 'components/forms/ParameterFormDepartment';
import { UserContext } from 'pages/_app';
import ErrorInformation from "components/layout/ErrorInformation";
import ParameterDroppingReviewer from "components/forms/ParameterDroppingReviewer";

const Anlegen: FC = () => {
    const { userId, admin, superAdmin } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(false);

    const [parameter, setParameter] = useState<number | null>(null);

    const [resultList, setResultList] = useState([]);
    const [categoryOptionsList, setCategoryOptionsList] = useState<ICategory[]>([]);

    const [addSuccessfulAlert, setAddSuccessfulAlert] = useState(false);
    const [duplicateErrorAlert, setDuplicateErrorAlert] = useState(false);

    const handleError = (error: any) => {
        console.log(error);
        setServerError(true);
        setLoading(false);
    };

    const getTableToFetch = (tableParam: number | null) => {
        switch (tableParam) {
            case 1:
                return 'type';
            case 2:
                return 'category';
            case 3:
                return 'location';
            case 4:
                return 'supplier';
            case 5:
                return 'department';
            case 6:
                return 'printer';
            case 7:
                return 'droppingReviewer';
            default:
                return '';
        }
    };

    const getRequest = () => {
        const tableToFetch = getTableToFetch(parameter);
        fetch(`${process.env.HOSTNAME}/api/inventorymanagement/` + tableToFetch, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            if (response.ok) {
                response
                    .json()
                    .then((result) => {
                        setResultList(result);
                    })
                    .catch((error) => {
                        handleError(error);
                    });
                setLoading(false);
            } else {
                handleError(response);
            }
        });
        setLoading(false);
    };

    useEffect(() => {
        if (parameter) {
            setLoading(true);
            setServerError(false);
            setAddSuccessfulAlert(false);
            setDuplicateErrorAlert(false);
            if (parameter === 1) {
                fetch(`${process.env.HOSTNAME}/api/inventorymanagement/category`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then((response) => {
                        if (response.ok) {
                            response
                                .json()
                                .then((result: ICategory[]) => {
                                    setCategoryOptionsList(result);
                                    getRequest();
                                })
                                .catch((error) => {
                                    handleError(error);
                                });
                        } else {
                            handleError(response);
                        }
                    })
                    .catch((error) => {
                        handleError(error);
                    });
            } else if (parameter === 7){
                setLoading(false);
            }
            else {
                getRequest();
            }
        }
    }, [parameter]);

    const postRequestClick = (e: MouseEvent<HTMLButtonElement>, objectToSend: IObjectToSend | null, tableToFetch: string) => {
        e.preventDefault();
        setServerError(false);
        setAddSuccessfulAlert(false);
        setDuplicateErrorAlert(false);
        if (tableToFetch && objectToSend) {
            fetch(`${process.env.HOSTNAME}/api/inventorymanagement/` + tableToFetch, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(objectToSend)
            }).then((response) => {
                if (response.ok) {
                    setAddSuccessfulAlert(true);
                    getRequest();
                } else {
                    setDuplicateErrorAlert(true);
                }
            });
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 12 }}>
                <Typography
                    variant="h1"
                    align="center"
                    gutterBottom
                    id="parameterAnlegenHeader"
                >
                    Parameter anlegen
                </Typography>
                <Box sx={{ my: 3 }} />
                <Grid
                    container
                    justifyContent="center"
                >
                    <CustomSelect
                        label="Parameter wählen"
                        setValue={setParameter}
                        error={false}
                        admin={admin}
                        superAdmin={superAdmin}
                    />
                </Grid>
                {loading ? (
                    <LoadingSpinner />
                ) : serverError ? (
                    <ErrorInformation></ErrorInformation>
                ) : (
                    <>
                        {parameter !== 7 && <ParameterForm
                            parameter={parameter}
                            tableList={resultList}
                            categoryOptions={categoryOptionsList}
                            addSuccessfulAlert={addSuccessfulAlert}
                            duplicateErrorAlert={duplicateErrorAlert}
                            onClick={postRequestClick}
                            setAddedSuccessfulAlert={setAddSuccessfulAlert}
                            setDuplicateErrorAlert={setDuplicateErrorAlert}
                        />}
                        {parameter === 5 && (
                            <ParameterFormDepartment
                                userId={userId}
                                departmentList={resultList}
                                addNewDepartmentSuccessfulAlert={addSuccessfulAlert}
                                addNewDepartmentDuplicateErrorAlert={duplicateErrorAlert}
                                onClick={postRequestClick}
                                setLoading={setLoading}
                                setServerError={setServerError}
                                setAddNewDepartmentSuccessfulAlert={setAddSuccessfulAlert}
                                setAddNewDepartmentDuplicateErrorAlert={setDuplicateErrorAlert}
                            />
                        )}
                        {parameter === 7 &&(<ParameterDroppingReviewer></ParameterDroppingReviewer>)}
                    </>
                )}
            </Box>
        </Container>
    );
};
export default Anlegen;
