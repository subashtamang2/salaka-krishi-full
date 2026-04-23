import { Autocomplete, Chip, TextField, Typography } from '@mui/material';
import { Add } from '@wandersonalwes/iconsax-react';
import React from 'react'

interface PropsInterface {
    keywords: string[] | null;
    formik: any;
    placeholder?: string;
    fieldName?: string;
}

export default function AutocompleteCard({ keywords, formik, placeholder, fieldName }: PropsInterface) {
    let TagsError = "";

    const err = formik.errors[fieldName || "keywords"];

    if (formik.touched[fieldName || "keywords"] && err) {
        if (typeof err === "string") {
            TagsError = err;
        } else if (Array.isArray(err)) {
            const errArray = err as any[];

            const firstLabel = errArray.find(
                (item) => item && typeof item === "object" && "label" in item
            );

            if (firstLabel) TagsError = firstLabel.label;
        }
    }


    return (
        <Autocomplete
            id={fieldName || "keywords"}
            multiple
            fullWidth
            autoHighlight
            freeSolo
            disableCloseOnSelect
            options={keywords!}
            value={formik.values[fieldName || "keywords"]}
            onBlur={formik.handleBlur}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
                const jobExist = keywords!.includes(newValue[newValue.length - 1]);
                if (!jobExist) {
                    formik.setFieldValue(fieldName || "keywords", newValue);
                } else {
                    formik.setFieldValue(fieldName || "keywords", newValue);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    name={fieldName || "keywords"}
                    placeholder={placeholder || "SEO keywords"}
                    error={formik.touched[fieldName || "keywords"] && Boolean(formik.errors[fieldName || "keywords"])}
                    helperText={TagsError}
                />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                    let error = false;
                    if (
                        formik.touched.keywords &&
                        formik.errors.keywords &&
                        typeof formik.errors.keywords !== "string"
                    ) {
                        if (typeof formik.errors.keywords[index] === "object") error = true;
                    }

                    return (
                        <Chip
                            {...getTagProps({ index })}
                            variant="combined"
                            key={index}
                            color={error ? "error" : "secondary"}
                            label={
                                <Typography variant="caption" sx={{ color: "secondary.dark" }}>
                                    {option}
                                </Typography>
                            }
                            deleteIcon={<Add style={{ fontSize: "0.875rem", transform: "rotate(45deg)" }} />}
                            size="small"
                        />
                    );
                })
            }
        />
    )
}
