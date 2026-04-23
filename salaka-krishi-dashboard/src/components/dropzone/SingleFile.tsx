import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useDropzone } from 'react-dropzone';
import PlaceholderContent from './PlaceholderContent';
import RejectionFiles from './RejectionFiles';
import { CustomFile, UploadProps } from 'types/dropzone';

const DropzoneWrapper = styled('div')(({ theme }) => ({
    outline: 'none',
    overflow: 'hidden',
    position: 'relative',
    padding: theme.spacing(5, 1),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('padding'),
    backgroundColor: theme.palette.background.paper,
    border: '1px dashed',
    borderColor: theme.palette.secondary.main,
    '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));


export default function SingleFileUpload({ error, file, setFieldValue, sx }: UploadProps) {
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        accept: {
            'image/*': []
        },
        multiple: false,
        onDrop: (acceptedFiles: CustomFile[]) => {
            const file = Object.assign(acceptedFiles[0], {
                preview: URL.createObjectURL(acceptedFiles[0])
            });
            setFieldValue('file', file);
        }
    });

    const thumbs =
        file &&
        <CardMedia
            key={file.name}
            component="img"
            src={file.preview}
            sx={{
                top: 8,
                left: 8,
                borderRadius: 2,
                position: 'absolute',
                width: 'calc(100% - 16px)',
                height: 'calc(100% - 16px)',
                bgcolor: 'background.paper'
            }}
            onLoad={() => {
                URL.revokeObjectURL(file.preview!);
            }}
        />
        ;
    const onRemove = () => {
        setFieldValue('file', null);
    };

    return (
        <Box sx={{ width: '100%', ...sx }}>
            <DropzoneWrapper
                {...getRootProps()}
                sx={{
                    ...(isDragActive && { opacity: 0.72 }),
                    ...((isDragReject || error) && {
                        color: 'error.main',
                        borderColor: 'error.light',
                        bgcolor: 'error.lighter'
                    }),
                    ...(file && {
                        padding: '12% 0'
                    })
                }}
            >
                <input {...getInputProps()} />
                <PlaceholderContent />
                {thumbs}
            </DropzoneWrapper>

            {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

            {file && (
                <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 1.5 }}>
                    <Button variant="contained" color="error" onClick={onRemove}>
                        Remove
                    </Button>
                </Stack>
            )}
        </Box>
    );
}
