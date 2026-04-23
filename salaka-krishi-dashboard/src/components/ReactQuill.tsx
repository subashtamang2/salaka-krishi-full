'use client';

import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';


interface Props {
    value?: string;
    editorMinHeight?: number;
    onChange?: (value: string) => void;
    formik: any;
    fieldName?: string;
}


export default function ReactQuillDemo({ value, editorMinHeight = 135, formik, fieldName = "history", }: Props) {
    const handleChange = (content: string, delta: any, source: string, editor: any) => {
        if (source === "user") {
            const currentValue = formik.values[fieldName] || "";
            if (content !== currentValue) {
                formik.setFieldValue(fieldName, content);
            }
        }
    };
    return (
        <Box
            sx={(theme) => ({
                '& .quill': {
                    bgcolor: 'background.paper',
                    ...theme.applyStyles('dark', { bgcolor: 'secondary.main' }),
                    borderRadius: '4px',
                    '& .ql-toolbar': {
                        bgcolor: 'secondary.100',
                        ...theme.applyStyles('dark', { bgcolor: 'secondary.light' }),
                        borderColor: 'divider',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px'
                    },
                    '& .ql-container': {
                        bgcolor: 'transparent',
                        ...theme.applyStyles('dark', { bgcolor: 'background.default' }),
                        borderColor: `${theme.palette.secondary.light} !important`,
                        borderBottomLeftRadius: '8px',
                        borderBottomRightRadius: '8px',
                        '& .ql-editor': { minHeight: editorMinHeight }
                    },
                }
            })}
        >
            <ReactQuill value={value || ""}
                onChange={handleChange} />
        </Box>
    );
}
