import { ApiProperty } from "@nestjs/swagger";
export class CreateFileSystemDto {
    @ApiProperty({
        type: "string",
        format: "binary",
    })
    file: any;
}
export class CreateMultipleFileSystem {
    @ApiProperty({
        type: "array",
        items: {
            type: "string",
            format: "binary",
        },
    })
    files: any[];
}
