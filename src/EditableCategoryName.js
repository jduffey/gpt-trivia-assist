import React, { useState } from 'react';

import { TextField } from '@mui/material';

const EditableCategoryName = ({
    categoryName,
    onCategoryNameChange
}) => {
    const [localCategoryName, setLocalCategoryName] = useState(categoryName);

    const handleBlur = () => {
        onCategoryNameChange(localCategoryName);
    };

    const handleChange = (event) => {
        setLocalCategoryName(event.target.value);
    };

    return (
        <TextField
            label="Category Name"
            value={localCategoryName}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
        />
    )
}

export default EditableCategoryName;
