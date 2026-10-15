import ExcelJS from 'exceljs';

interface RoomFullExportInput {
    roomLabel: string;
    startTime: string;
    endTime: string;
    candidates: { fullName: string; email: string }[];
}

export async function buildRoomFullExcel(input: RoomFullExportInput): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Inscritos');

    sheet.columns = [
        { header: 'Nome', key: 'fullName', width: 40 },
        { header: 'Email', key: 'email', width: 35 },
        { header: 'Sala', key: 'room', width: 15 },
        { header: 'Horário', key: 'time', width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    for (const candidate of input.candidates) {
        sheet.addRow({
            fullName: candidate.fullName,
            email: candidate.email,
            room: input.roomLabel,
            time: `${input.startTime} às ${input.endTime}`,
        });
    }

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
}
