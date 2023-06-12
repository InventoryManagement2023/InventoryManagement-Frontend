import {Grid} from '@mui/material';
import {FC, useContext, useEffect, useState} from 'react';
import {
    ICategory,
    IDepartment,
    IDetailInventoryItem,
    ILocation,
    IPrinter,
    ISupplier,
    IType
} from 'components/interfaces';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import {UserContext} from 'pages/_app';
import {
    defaultInventory,
    inventoryFormRequiredSchema
} from 'components/forms/inventory-form/inventoryFormDefaultValues';
import CustomDatePicker from 'components/form-fields/CustomDatePicker';

import {format} from "date-fns";
import CustomTextField from 'components/form-fields/CustomTextField';
import CustomButton from "components/form-fields/CustomButton";

interface IExportFormTable {
    department?: IDepartment;
    type?: IType;
    category?: ICategory;
    supplier?: ISupplier;
    status?: string;
    location?: ILocation;
    anlagedatumVon: string;
    anlagedatumBis: string;
    lieferdatumVon: string;
    lieferdatumBis: string;
    ausgabedatumVon: string;
    ausgabedatumBis: string;
    ausscheidedatumVon: string;
    ausscheidedatumBis: string;
}

interface ExportFormProps {
    department?: IDepartment[];
    type?: IType[];
    printer?: IPrinter[];

    category: ICategory[];
    supplier?: ISupplier[];
    status?: String;
    location?: ILocation[];
    initialCreation?: boolean;
    preFilledValues?: IDetailInventoryItem;

    disabled: boolean;
}

const ExportForm: FC<ExportFormProps> = (props) => {
    const [formValidation] = useState(JSON.parse(JSON.stringify(inventoryFormRequiredSchema)));
    const {userId} = useContext(UserContext);
    const {department, category, supplier, location, initialCreation, preFilledValues, type, disabled} = props;
    const [exportForm, setExportForm] = useState<IExportFormTable>(
        preFilledValues
            ? {
                ...preFilledValues,
                pictures: undefined
            }
            : JSON.parse(JSON.stringify(defaultInventory))
    );

    useEffect(() => {
        if (initialCreation) {
            fetch(`${process.env.HOSTNAME}/api/inventorymanagement/department/user/${userId}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
                .then((response) => {
                    if (response.ok) {
                        response
                            .json()
                            .then((result) => {
                                console.log(result);
                                setExportForm({...exportForm, department: result});
                            })
                            .catch((error) => {
                                console.log(error.message);
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

    const handleExport = () => {
        const {
            department,
            category,
            type,
            anlagedatumBis,
            anlagedatumVon,
            ausgabedatumBis,
            ausgabedatumVon,
            ausscheidedatumBis,
            ausscheidedatumVon,
            lieferdatumBis,
            lieferdatumVon,
            location,
            status,
            supplier
        } = exportForm;

        let queryParams = "";

        if (department) {
            queryParams += `departmentId=${department.id}&`;
        }
        if (category) {
            queryParams += `categoryId=${category.id}&`;
        }
        if (type) {
            queryParams += `typeId=${type.id}&`;
        }
        if (anlagedatumBis) {
            queryParams += `changeDateTo=${anlagedatumBis}&`;
        }
        if (anlagedatumVon) {
            queryParams += `changeDateFrom=${anlagedatumVon}&`;
        }
        if (ausgabedatumBis) {
            queryParams += `issueDateTo=${ausgabedatumBis}&`;
        }
        if (ausgabedatumVon) {
            queryParams += `issueDateFrom=${ausgabedatumVon}&`;
        }
        if (ausscheidedatumBis) {
            queryParams += `droppingDateTo=${ausscheidedatumBis}&`;
        }
        if (ausscheidedatumVon) {
            queryParams += `droppingDateFrom=${ausscheidedatumVon}&`;
        }
        if (lieferdatumBis) {
            queryParams += `deliveryDateTo=${lieferdatumBis}&`;
        }
        if (lieferdatumVon) {
            queryParams += `deliveryDateFrom=${lieferdatumVon}&`;
        }
        if (location) {
            queryParams += `locationId=${location.id}&`;
        }
        if (status) {
            queryParams += `status=${status}&`;
        }
        if (supplier) {
            queryParams += `supplierId=${supplier.id}&`;
        }

        fetch(
            `${process.env.HOSTNAME}/api/inventorymanagement/inventory/export?${queryParams}`,
            {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }
        ).then((res) => {
            if (res.ok) {
                res.blob()
                    .then((res) => {
                        const url = window.URL.createObjectURL(res);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = "Inventorymanagment_" + format(new Date(), "dd-MM-yyyy_HH-mm-ss") + ".xlsx";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            }
        });
    };
    console.log(department, exportForm)

    return (
        <>
            <Grid
                display={'flex'}
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                {department && exportForm && (
                    <CustomAutocomplete
                        options={department}
                        optionKey="departmentName"
                        label="Abteilung"
                        value={exportForm.department?.departmentName ?? ''}
                        setValue={(val) => {
                            setExportForm({...exportForm, department: val} as IExportFormTable);
                        }}
                        error={formValidation.find((field) => field.name === 'department')?.error ?? false}
                        required={false}
                        disabled={disabled}
                    />
                )}
            </Grid>
            <Grid
                display={'flex'}
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                {category && exportForm && (
                    <CustomAutocomplete
                        options={category}
                        optionKey="categoryName"
                        label="Kategorie"
                        value={exportForm.category?.categoryName ?? ''}
                        setValue={(val) => {
                            setExportForm({...exportForm, category: val} as IExportFormTable);
                        }}
                        error={formValidation.find((field) => field.name === 'category')?.error ?? false}
                        required={false}
                        disabled={disabled}
                    />
                )}
            </Grid>
            <Grid
                display={'flex'}
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                <CustomDatePicker
                    label="Anlagedatum von"
                    value={exportForm.anlagedatumVon}
                    setValue={(val) => {
                        setExportForm({...exportForm, anlagedatumVon: val} as IExportFormTable);
                    }}
                    required={false}
                    disabled={disabled}
                />
                <CustomDatePicker
                    label="Anlagedatum bis"
                    value={exportForm.anlagedatumBis}
                    setValue={(val) => {
                        setExportForm({...exportForm, anlagedatumBis: val} as IExportFormTable);
                    }}
                    required={false}
                    disabled={disabled}
                />
            </Grid>
            <Grid
                display={'flex'}
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                <CustomDatePicker
                    label="Lieferdatum von"
                    value={exportForm.lieferdatumVon}
                    setValue={(val) => {
                        setExportForm({...exportForm, lieferdatumVon: val} as IExportFormTable);
                    }}
                    required={false}
                    disabled={disabled}
                />
                <CustomDatePicker
                    label="Lieferdatum bis"
                    value={exportForm.lieferdatumBis}
                    setValue={(val) => {
                        setExportForm({...exportForm, lieferdatumBis: val} as IExportFormTable);
                    }}
                    required={false}
                    disabled={disabled}
                />
            </Grid>
            <Grid
                display={'flex'}
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                <CustomDatePicker
                    label="Ausgabedatum von"
                    value={exportForm.ausgabedatumVon}
                    setValue={(val) => {
                        setExportForm({...exportForm, ausgabedatumVon: val} as IExportFormTable);
                    }}
                    required={false}
                    disabled={disabled}
                />
                <CustomDatePicker
                    label="Ausgabedatum bis"
                    value={exportForm.ausgabedatumBis}
                    setValue={(val) => {
                        setExportForm({...exportForm, ausgabedatumBis: val} as IExportFormTable);
                    }}
                    required={false}
                    disabled={disabled}
                />
            </Grid>
            <Grid
                display={'flex'}
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                <CustomDatePicker
                    label="Ausscheidedatum von"
                    value={exportForm.ausscheidedatumVon}
                    setValue={(val) => {
                        setExportForm({...exportForm, ausscheidedatumVon: val} as IExportFormTable);
                    }}
                    required={false}
                    disabled={disabled}
                />
                <CustomDatePicker
                    label="Ausscheidedatum bis"
                    value={exportForm.ausscheidedatumBis}
                    setValue={(val) => {
                        setExportForm({...exportForm, ausscheidedatumBis: val} as IExportFormTable);
                    }}
                    required={false}
                    disabled={disabled}
                />
            </Grid>
            <Grid
                display={'flex'}
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                {type && exportForm && (
                    <CustomAutocomplete
                        options={type}
                        optionKey="typeName"
                        label="Typ"
                        value={exportForm.department?.departmentName ?? ''}
                        setValue={(val) => {
                            setExportForm({...exportForm, type: val} as IExportFormTable);
                        }}
                        error={formValidation.find((field) => field.name === 'type')?.error ?? false}
                        disabled={disabled}
                    />
                )}
            </Grid>
            <Grid
                display={'flex'}
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                {location && exportForm && (
                    <CustomAutocomplete
                        options={location}
                        optionKey="locationName"
                        label="Standort"
                        value={exportForm.department?.departmentName ?? ''}
                        setValue={(val) => {
                            setExportForm({...exportForm, location: val} as IExportFormTable);
                        }}
                        error={formValidation.find((field) => field.name === 'location')?.error ?? false}
                        disabled={disabled}
                    />
                )}
            </Grid>
            <Grid
                display={'flex'}
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                {supplier && exportForm && (
                    <CustomAutocomplete
                        options={supplier}
                        optionKey="supplierName"
                        label="Lieferant"
                        value={exportForm.department?.departmentName ?? ''}
                        setValue={(val) => {
                            setExportForm({...exportForm, supplier: val} as IExportFormTable);
                        }}
                        error={formValidation.find((field) => field.name === 'supplier')?.error ?? false}
                        disabled={disabled}
                    />
                )}
            </Grid>
            <Grid
                display={'flex'}
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                <CustomTextField
                    label="Status"
                    value={exportForm.status}
                    setValue={(val) => {
                        setExportForm({...exportForm, status: val} as IExportFormTable);
                    }}
                    error={false}
                />
            </Grid>

            <Grid
                display={'flex'}
                container
                justifyContent="center"
                marginTop="0.5em"
            >
                <CustomButton
                    onClick={handleExport}
                    label="Download"/>
            </Grid>
        </>
    );
};

export default ExportForm;
