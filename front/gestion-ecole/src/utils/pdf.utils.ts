import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Grade } from '../types/grade.types';

interface ReportCardData {
  studentName: string;
  grades: Grade[];
  average: string;
  academicYear: string;
  term: string;
}

export const pdfUtils = {
  generateReportCard: async ({
    studentName,
    grades,
    average,
    academicYear,
    term
  }: ReportCardData) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Bulletin de notes', 14, 20);
    doc.setFontSize(12);
    doc.text(`Nom de l'élève : ${studentName}`, 14, 30);
    doc.text(`Année scolaire : ${academicYear}`, 14, 37);
    doc.text(`Semestre : ${term}`, 14, 44);
    doc.text(`Moyenne : ${average}`, 14, 51);

    autoTable(doc, {
      startY: 60,
      head: [['Matière', 'Note', 'Type', 'Date', 'Commentaires']],
      body: grades.map(grade => [
        grade.subjectName,
        grade.score.toString(),
        grade.examType,
        new Date(grade.gradeDate).toLocaleDateString(),
        grade.comments || ''
      ])
    });

    doc.save(`Bulletin_${studentName.replace(/\s/g, '_')}.pdf`);
  }
};
