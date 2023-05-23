import {Button, Grid, Typography} from '@mui/material';
import {FC, useContext, useEffect, useState} from 'react';
import {ICategory, IDepartment, IDetailInventoryItem, ILocation, ISupplier, IType} from "components/interfaces";
import CustomAutocomplete from "components/form-fields/CustomAutocomplete";
import {UserContext} from "pages/_app";
import {
    defaultInventory,
    inventoryFormRequiredSchema
} from "components/forms/inventory-form/inventoryFormDefaultValues";
import CustomDatePicker from "components/form-fields/CustomDatePicker";
import CustomTextField from "components/form-fields/CustomTextField";


interface IExportFormTable {
    department?: IDepartment[];
    type?:IType[];
    category?:ICategory[];
    supplier?:ISupplier[];
    status?:String
    location?:ILocation[];
    anlagedatumVon: String;
    anlagedatumBis: String;
    lieferdatumVon: String;
    lieferdatumBis: String;
    ausgabedatumVon: String;
    ausgabedatumBis: String;
    ausscheidedatumVon: String;
    ausscheidedatumBis: String;
    initialCreation?: boolean;
    preFilledValues?: IDetailInventoryItem;
    showFilter:boolean
}



const ExportForm: FC<IExportFormTable> = (props) => {
    const [formValidation] = useState(JSON.parse(JSON.stringify(inventoryFormRequiredSchema)));
    const {userId} = useContext(UserContext);
    const {department, category, supplier, location, initialCreation, preFilledValues, type} = props;
    const [showFilter, changeFilter] = useState(false);
    //const [exportForm, setExportForm] = useState<IExportFormTable>();
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
                                console.log(result)
                                // @ts-ignore
                                setExportForm({...exportForm, department: result} as IDetailInventoryItem);
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

    function setFilter() {
        changeFilter(!showFilter);
    }


    let element = <><>
<Button

    onClick={()=> setFilter()}
>
    <Typography>Filter</Typography>
</Button>

        <Grid
            display={showFilter ? 'flex' : 'none'  }
            container
            justifyContent="center"
            marginTop="0.5em"
        >
            {department && exportForm && (
            <CustomAutocomplete

                options={department}
                optionKey="departmentName"
                label="Abteilung"
                //value={exportForm.department?.departmentName ?? ''}
                //value={exportForm.department[0].departmentName ''}
                setValue={(val) => {
                    setExportForm({...exportForm, department: val} as IExportFormTable);
                }}
                error={formValidation.find((field) => field.name === 'department')?.error ?? false}
                required={false}
                //disabled={disabled}
            />)}
        </Grid>
        <Grid
            display={showFilter ? 'flex' : 'none'  }
            container
            justifyContent="center"
            marginTop="0.5em"
        >
            {category && exportForm && (
                <CustomAutocomplete
                  options={category}
                    optionKey="categoryName"
                    label="Kategorie"
                    //value={exportForm.department?.departmentName ?? ''}
                    setValue={(val) => {
                        setExportForm({...exportForm, category: val} as IExportFormTable);
                    }}
                    error={formValidation.find((field) => field.name === 'category')?.error ?? false}
                    required={false}
                    //disabled={disabled}
                />)}
        </Grid>
        <Grid
            display={showFilter ? 'flex' : 'none'  }
            container
            justifyContent="center"
            marginTop="0.5em"
        >
            <CustomDatePicker
                label="Anlagedatum von"
                //value={anlagedatumVon}
                setValue={(val) => {
                    setExportForm({...exportForm, anlagedatumVon: val} as IExportFormTable);
                }}
                required={false}
                //disabled={disabled}
            />
            <CustomDatePicker
                label="Anlagedatum bis"
                //value={anlagedatumVon}
                setValue={(val) => {
                    setExportForm({...exportForm, anlagedatumBis: val} as IExportFormTable);
                }}
                required={false}
                //disabled={disabled}
            />
        </Grid>
        <Grid
            display={showFilter ? 'flex' : 'none'  }
            container
            justifyContent="center"
            marginTop="0.5em"
        >
            <CustomDatePicker
                label="Lieferdatum von"
                //value={anlagedatumVon}
                setValue={(val) => {
                    setExportForm({...exportForm, lieferdatumVon: val} as IExportFormTable);
                }}
                required={false}
                //disabled={disabled}
            />
            <CustomDatePicker
                label="Lieferdatum bis"
                //value={anlagedatumVon}
                setValue={(val) => {
                    setExportForm({...exportForm, lieferdatumBis: val} as IExportFormTable);
                }}
                required={false}
                //disabled={disabled}
            />
        </Grid>
        <Grid
            display={showFilter ? 'flex' : 'none'  }
            container
            justifyContent="center"
            marginTop="0.5em"
        >
            <CustomDatePicker
                label="Ausgabedatum von"
                //value={ausgabedatumVon}
                setValue={(val) => {
                    setExportForm({...exportForm, ausgabedatumVon: val} as IExportFormTable);
                }}
                required={false}
                //disabled={disabled}
            />
            <CustomDatePicker
                label="Ausgabedatum bis"
                //value={ausgabedatumBis}
                setValue={(val) => {
                    setExportForm({...exportForm, ausgabedatumBis: val} as IExportFormTable);
                }}
                required={false}
                //disabled={disabled}
            />
        </Grid>
        <Grid
            display={showFilter ? 'flex' : 'none'  }
            container
            justifyContent="center"
            marginTop="0.5em"
        >
            <CustomDatePicker
                label="Ausscheidedatum von"
                //value={ausscheidedatumVon}
                setValue={(val) => {
                    setExportForm({...exportForm, ausscheidedatumVon: val} as IExportFormTable);
                }}
                required={false}
                //disabled={disabled}
            />
            <CustomDatePicker
                label="Ausscheidedatum bis"
                //value={ausscheidedatumBis}
                setValue={(val) => {
                    setExportForm({...exportForm, ausscheidedatumBis: val} as IExportFormTable);
                }}
                required={false}
                //disabled={disabled}
            />
        </Grid>
        <Grid
            display={showFilter ? 'flex' : 'none'  }
            container
            justifyContent="center"
            marginTop="0.5em"
        >
            {type && exportForm && (
                <CustomAutocomplete
                    options={type}
                    optionKey="typeName"
                    label="Typ"
                    //value={exportForm.department?.departmentName ?? ''}
                    setValue={(val) => {
                        setExportForm({...exportForm, type: val} as IExportFormTable);
                    }}
                    error={formValidation.find((field) => field.name === 'type')?.error ?? false}

                    //disabled={disabled}
                />)}
        </Grid>
        <Grid
            display={showFilter ? 'flex' : 'none'  }
            container
            justifyContent="center"
            marginTop="0.5em"
        >
            {location && exportForm && (
                <CustomAutocomplete
                    options={location}
                    optionKey="locationName"
                    label="Standort"
                    //value={exportForm.department?.departmentName ?? ''}
                    setValue={(val) => {
                        setExportForm({...exportForm, location: val} as IExportFormTable);
                    }}
                    error={formValidation.find((field) => field.name === 'location')?.error ?? false}

                    //disabled={disabled}
                />)}
        </Grid>
        <Grid
            display={showFilter ? 'flex' : 'none'  }
            container
            justifyContent="center"
            marginTop="0.5em"
        >
            {supplier && exportForm && (
                <CustomAutocomplete
                    options={supplier}
                    optionKey="supplierName"
                    label="Lieferant"
                    //value={exportForm.department?.departmentName ?? ''}
                    setValue={(val) => {
                        setExportForm({...exportForm, supplier: val} as IExportFormTable);
                    }}
                    error={formValidation.find((field) => field.name === 'supplier')?.error ?? false}

                    //disabled={disabled}
                />)}
        </Grid>
        <Grid
            display={showFilter ? 'flex' : 'none'  }
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

    </>
    </>;
    return element;
};

export default ExportForm;
