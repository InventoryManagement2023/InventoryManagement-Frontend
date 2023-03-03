import { Box, Divider } from '@mui/material';

const CustomDivider = () => {
    return (
        <>
            <Box sx={{ my: 2 }} />
            <Divider
                flexItem={true}
                sx={{ borderBottomWidth: 5, margin: 'auto', width: '92%' }}
            />
            <Box sx={{ my: 2 }} />
        </>
    );
};

export default CustomDivider;
