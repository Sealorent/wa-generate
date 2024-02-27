import { useState } from 'react';
import * as XLSX from 'xlsx';

interface TableRow {
    [key: string]: any;
}

function ImportComponent() {
    const [file, setFile] = useState<File | null>(null); // Specify the type as File | null
    const [tableData, setTableData] = useState<TableRow[]>([]); // Initialize state to hold table data

    const handleConvert = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result;
                if (data) {
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(sheet);
                    setTableData(json as TableRow[]); // Set the table data
                }
            };
            reader.readAsBinaryString(file);
        }
    };

    const generateWhatsAppLink = (phoneNumber: string, message: string) => {
        let formattedNumber = phoneNumber;
        if (phoneNumber.startsWith('0')) {
            formattedNumber = '62' + phoneNumber.slice(1);
        }
        // const encodedMessage = encodeURIComponent(message);
        return `https://api.whatsapp.com/send/?phone=${formattedNumber}&text=${message}`;
    };
    

    return (
        <div>
            <input type="file" accept=".xls,.xlsx" onChange={e => setFile(e.target.files?.[0] || null)} />
            <button onClick={handleConvert}>Convert</button>
            <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
                <thead>
                    <tr>
                        {tableData.length > 0 && Object.keys(tableData[0]).map((key, index) => (
                            <th key={index} style={{ border: '1px solid black', padding: '8px' }}>{key}</th>
                        ))}
                        <th style={{ border: '1px solid black', padding: '8px' }}>Template Message</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>WhatsApp</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {Object.entries(row).map(([value], cellIndex) => (
                                <td key={cellIndex} style={{ border: '1px solid black', padding: '8px' }}>{value}</td>
                            ))}
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <p>
                                    Halo, Bapak/Ibu {row['NAMA PENSIUN']}, terima kasih telah mendaftar di Kampung Inggris LC. Kami akan segera menghubungi Anda.
                                </p>
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <a href={generateWhatsAppLink(row['NO_TLP1'], `
                                        Selamat Sore ${row['NAMA PENSIUN'].replace(/\s/g, '')}, Saya Ratna Dari Bank Mandiri Taspen kantor cabang Kediri jalan Brawijaya. ingin menyampaikan bahwa kenaikan gaji rapel 2bulan sudah masuk nggih 🙏🏻dan Mohon izin menyampaikan Di Bank Mandiri taspen ada program Deposito bu dengan bunga 3,50% minimal penempatan 1jt an saja jangka waktu 1 bulan, ibu nanti juga bisa dapat gift/hadiah bisa pilih yang ada di Display kantor kami. Ada juga program Tabungan berjangka, minimal ikut kelipatan 100ribu/bulan dengan jangka waktu 1tahun atau 12 bulan, cairnya langsung otomatis di rekening ibu, tidak ada biaya apapun. monggo silakan jika berkenan atau ada yang ditanyakan bisa langsung wa saya atau datang ke kantor cabang kediri, kami tunggu kabar baiknya Ibu, terimakasih semoga sehat selalu🙏🏻😊
                                        `)} target="_blank" rel="noopener noreferrer">
                                    <button>Contact via WhatsApp</button>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ImportComponent;
