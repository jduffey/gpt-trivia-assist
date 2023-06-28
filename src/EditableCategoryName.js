import React from 'react';

const EditableCategoryName = ({
    categoryName,
    onCollapseChange
}) => {
    return (
        <div
            onClick={onCollapseChange}
            style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
            }}
        >
            {categoryName}
        </div>
    )
}

export default EditableCategoryName;
