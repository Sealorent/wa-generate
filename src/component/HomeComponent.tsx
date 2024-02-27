import React, { useState, useEffect } from "react";  
import { read, utils, writeFile } from 'xlsx';

const HomeComponent = () => {
    const [surveys, setSurvey] = useState<Survey[]>([]);

    useEffect(() => {
        fetchSurveyData();
    }, []);

    useEffect(() => {
        console.log('Updated surveys:', surveys);
    }, [surveys]);

    const handleImport = ($event: React.ChangeEvent<HTMLInputElement>) => {
        const files = $event.target.files;
        if (files && files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const target = event.target;
                if (target instanceof FileReader && target.result) {
                    const wb = read(target.result as ArrayBuffer);
                    const sheets = wb.SheetNames;
    
                    if (sheets.length) {
                        const rows : any = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                        setSurvey(rows);
                    }
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };
    
    const fetchSurveyData = async () => {
        try {
            const response = await fetch('https://marketing-service.kampunginggrislc.com/api/marketing-service/survey');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const datas = await response.json();
            const data: Survey[] = datas.message;
            setSurvey(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleExport = () => {
        console.log('Exporting data:', surveys);
    
        const dateNow = new Date().toISOString().split('T')[0];
    
        const headings = [
            'Name', 
            'Number Whatsapp', 
            'Domisili', 
            'Customer Service', 
            'Course Period',
            'Arrival Date',
            'Arrival Time',
            'Account Instagram',
            'Notes'
        ];

        const headerStyle = {
            fill: {
                fgColor: { rgb: 'FF0000' }, // Red color
            },
            font: {
                color: { rgb: 'FFFFFF' }, // White color
                bold: true,
            },
        };
    
        const data = surveys.map(survey => [
            survey.name, 
            survey.number_whatsapp, 
            survey.domicile,
            survey.customer_service, 
            survey.course_period,
            survey.arrival_date,
            survey.arrival_time,
            survey.account_instagram,
            survey.notes
        ]);
    
        const wb = utils.book_new();
        const ws = utils.aoa_to_sheet([headings, ...data]);
        

        utils.book_append_sheet(wb, ws, 'Report');
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, `Survey Report ${dateNow}.xlsx`);
    }

    return (
        <>
            <div className="row mb-2 mt-5">
                <div className="col-sm-6 offset-3">
                    <div className="row">
                        <div className="col-md-6">
                            <button onClick={handleExport} className="btn btn-primary float-right">
                                Export <i className="fa fa-download"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6 offset-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Nama</th>
                                <th scope="col">Number Whatsapp</th>
                                <th scope="col">Domisili</th>
                                <th scope="col">Customer Service</th>
                                <th scope="col">Course Period</th>
                                <th scope="col">Arrival Date</th>
                                <th scope="col">Arrival Time</th>
                                <th scope="col">Account Instagram</th>
                                <th scope="col">Notes</th>
                            </tr>
                        </thead>
                        <tbody> 
                                {
                                    surveys.length
                                    ?
                                    surveys.map((survey, index) => (
                                        <tr key={index}>
                                            <th scope="row">{ index + 1 }</th>
                                            <td>{ survey.name }</td>
                                            <td>{ survey.number_whatsapp }</td>
                                            <td>{ survey.domicile }</td>
                                            <td>{ survey.domicile }</td>
                                            <td>{ survey.customer_service }</td>
                                            <td>{ survey.course_period }</td>
                                            <td>{ survey.arrival_date }</td>
                                            <td>{ survey.arrival_time }</td>
                                            <td>{ survey.account_instagram }</td>
                                            <td>{ survey.notes }</td>
                                        </tr> 
                                    ))
                                    :
                                    <tr>
                                        <td colSpan={5} className="text-center">No Movies Found.</td>
                                    </tr> 
                                }
                        </tbody>
                    </table>
                </div>
            </div>
        </>

    );
};

export default HomeComponent;
