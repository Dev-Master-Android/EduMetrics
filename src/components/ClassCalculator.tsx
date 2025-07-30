import { useState } from 'react';
import { Plus, Trash2, Users, BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

interface SubjectGrades {
  id: string;
  name: string;
  studentCount: number;
  grade5: number;
  grade4: number;
  grade3: number;
  grade2: number;
  averageGrade?: number;
  knowledgeQuality?: number;
  performance?: number;
}

interface ClassResults {
  className: string;
  subjects: SubjectGrades[];
  overallAverage: number;
  overallQuality: number;
  overallPerformance: number;
}

const ClassCalculator = () => {
  const [className, setClassName] = useState(() => 
    localStorage.getItem('className') || ''
  );
  const [subjects, setSubjects] = useState<SubjectGrades[]>(() => {
    const saved = localStorage.getItem('classSubjects');
    return saved ? JSON.parse(saved) : [];
  });
  const [results, setResults] = useState<ClassResults | null>(null);

  const addSubject = () => {
    const newSubject: SubjectGrades = {
      id: Date.now().toString(),
      name: '',
      studentCount: 0,
      grade5: 0,
      grade4: 0,
      grade3: 0,
      grade2: 0
    };
    const newSubjects = [...subjects, newSubject];
    setSubjects(newSubjects);
    localStorage.setItem('classSubjects', JSON.stringify(newSubjects));
  };

  const removeSubject = (id: string) => {
    const newSubjects = subjects.filter(subject => subject.id !== id);
    setSubjects(newSubjects);
    localStorage.setItem('classSubjects', JSON.stringify(newSubjects));
  };

  const updateSubject = (id: string, field: keyof SubjectGrades, value: string | number) => {
    const newSubjects = subjects.map(subject => 
      subject.id === id ? { ...subject, [field]: value } : subject
    );
    setSubjects(newSubjects);
    localStorage.setItem('classSubjects', JSON.stringify(newSubjects));
  };

  const handleNumericInputFocus = (id: string, field: keyof SubjectGrades, currentValue: number) => {
    if (currentValue === 0) {
      updateSubject(id, field, '');
    }
  };

  const handleNumericInputBlur = (id: string, field: keyof SubjectGrades, value: string) => {
    const numValue = parseInt(value) || 0;
    updateSubject(id, field, numValue);
  };

  const calculateClassMetrics = () => {
    // Проверяем, что есть хотя бы один предмет
    if (subjects.length === 0) {
      alert('Ошибка: Добавьте хотя бы один предмет!');
      return;
    }

    // Проверяем валидность данных для каждого предмета
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      const totalGrades = subject.grade5 + subject.grade4 + subject.grade3 + subject.grade2;
      
      if (subject.name.trim() === '') {
        alert(`Ошибка: Введите название предмета №${i + 1}!`);
        return;
      }
      
      if (subject.studentCount === 0) {
        alert(`Ошибка: Введите количество учеников для предмета "${subject.name}"!`);
        return;
      }
      
      if (totalGrades === 0) {
        alert(`Ошибка: Введите хотя бы одну оценку для предмета "${subject.name}"!`);
        return;
      }
      
      if (totalGrades !== subject.studentCount) {
        alert(`Ошибка: Количество учеников (${subject.studentCount}) не совпадает с общим количеством оценок (${totalGrades}) для предмета "${subject.name}"!`);
        return;
      }
    }

    const calculatedSubjects = subjects.map(subject => {
      const totalGrades = subject.grade5 + subject.grade4 + subject.grade3 + subject.grade2;
      if (totalGrades === 0) return { ...subject, averageGrade: 0, knowledgeQuality: 0, performance: 0 };

      const weightedSum = (subject.grade5 * 5) + (subject.grade4 * 4) + (subject.grade3 * 3) + (subject.grade2 * 2);
      const averageGrade = weightedSum / totalGrades;
      const qualityGrades = subject.grade5 + subject.grade4;
      const knowledgeQuality = (qualityGrades / totalGrades) * 100;
      const performanceGrades = subject.grade5 + subject.grade4 + subject.grade3;
      const performance = (performanceGrades / totalGrades) * 100;

      return {
        ...subject,
        averageGrade: parseFloat(averageGrade.toFixed(2)),
        knowledgeQuality: parseFloat(knowledgeQuality.toFixed(1)),
        performance: parseFloat(performance.toFixed(1))
      };
    });

    const validSubjects = calculatedSubjects.filter(s => s.averageGrade > 0);
    
    // Правильный расчет общих показателей класса согласно методическим рекомендациям
    let totalClassGrades = 0;
    let totalClassWeightedSum = 0;
    let totalClassQualityGrades = 0;
    let totalClassPerformanceGrades = 0;
    
    validSubjects.forEach(subject => {
      const subjectTotalGrades = subject.grade5 + subject.grade4 + subject.grade3 + subject.grade2;
      totalClassGrades += subjectTotalGrades;
      totalClassWeightedSum += (subject.grade5 * 5) + (subject.grade4 * 4) + (subject.grade3 * 3) + (subject.grade2 * 2);
      totalClassQualityGrades += subject.grade5 + subject.grade4;
      totalClassPerformanceGrades += subject.grade5 + subject.grade4 + subject.grade3;
    });
    
    // Средний балл класса = (Σ (оценка × количество)) / Общее количество оценок
    const overallAverage = totalClassGrades > 0 ? totalClassWeightedSum / totalClassGrades : 0;
    
    // Качество знаний класса = (Общее количество "5" и "4") × 100% / (Общее количество оценок)
    const overallQuality = totalClassGrades > 0 ? (totalClassQualityGrades / totalClassGrades) * 100 : 0;
    
    // Успеваемость класса = (Общее количество "3", "4", "5") × 100% / (Общее количество оценок)
    const overallPerformance = totalClassGrades > 0 ? (totalClassPerformanceGrades / totalClassGrades) * 100 : 0;

    // Сохраняем данные в localStorage
    localStorage.setItem('className', className);
    localStorage.setItem('classSubjects', JSON.stringify(subjects));

    setResults({
      className,
      subjects: calculatedSubjects,
      overallAverage: parseFloat(overallAverage.toFixed(2)),
      overallQuality: parseFloat(overallQuality.toFixed(1)),
      overallPerformance: parseFloat(overallPerformance.toFixed(1))
    });
  };

  const chartData = results?.subjects.map(subject => ({
    name: subject.name || '',
    average: subject.averageGrade || 0,
    quality: subject.knowledgeQuality || 0,
    performance: subject.performance || 0
  })) || [];



  const downloadXLSX = async () => {
    if (!results) return;
    
    // Создаем новую рабочую книгу ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Отчет по классу');
    
    // Настройки ширины колонок
    worksheet.columns = [
      { header: '', key: 'subject', width: 28 },
      { header: 'Средний балл', key: 'average', width: 16 },
      { header: 'Качество знаний', key: 'quality', width: 18 },
      { header: 'Успеваемость', key: 'performance', width: 16 },
      { header: 'Всего оценок', key: 'total', width: 16 },
      { header: 'Оценок 5', key: 'grade5', width: 14 },
      { header: 'Оценок 4', key: 'grade4', width: 14 },
      { header: 'Оценок 3', key: 'grade3', width: 14 },
      { header: 'Оценок 2', key: 'grade2', width: 14 }
    ];
    
    // Добавляем заголовок с современным дизайном
    const titleRow = worksheet.addRow(['EduMetrics - Отчет по классу']);
    titleRow.font = { bold: true, size: 18, color: { argb: 'FFFFFFFF' } };
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
    titleRow.height = 35;
    worksheet.mergeCells('A1:I1');
    
    // Создаем градиентный фон для заголовка
    titleRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' }
    };
    
    // Добавляем тень для заголовка
    titleRow.getCell(1).border = {
      bottom: { style: 'medium', color: { argb: 'FF1E40AF' } }
    };
    
    // Пустая строка
    worksheet.addRow([]);
    
    // Информация о классе с современным дизайном
    const classRow = worksheet.addRow(['Класс:', results.className || 'Не указан']);
    classRow.font = { bold: true, size: 14, color: { argb: 'FF2563EB' } };
    classRow.height = 25;
    classRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } };
    classRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    worksheet.mergeCells('A2:I2');
    
    // Добавляем границы для секции класса
    classRow.getCell(1).border = {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
    };
    
    // Информация о количестве учеников
    const totalStudents = results.subjects.length > 0 ? results.subjects[0].studentCount : 0;
    const studentsRow = worksheet.addRow(['Количество учеников:', totalStudents]);
    studentsRow.font = { bold: true, size: 14, color: { argb: 'FF2563EB' } };
    studentsRow.height = 25;
    studentsRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } };
    studentsRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    worksheet.mergeCells('A3:I3');
    
    // Добавляем границы для секции количества учеников
    studentsRow.getCell(1).border = {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
    };
    
    // Добавляем границы для секции класса
    classRow.getCell(1).border = {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
    };
    
    // Пустая строка
    worksheet.addRow([]);
    
    // Общие показатели с карточным дизайном
    const indicatorsRow = worksheet.addRow(['Общие показатели класса:']);
    indicatorsRow.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
    indicatorsRow.height = 28;
    indicatorsRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    indicatorsRow.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.mergeCells('A7:I7');
    
    // Данные показателей с цветовым кодированием
    const metricsData = [
      ['Средний балл по классу:', results.overallAverage, '📊'],
      ['Качество знаний по классу:', `${results.overallQuality}%`, '📈'],
      ['Успеваемость по классу:', `${results.overallPerformance}%`, '🎯']
    ];
    
    metricsData.forEach((data, index) => {
      const row = worksheet.addRow(data);
      row.height = 22;
      
      // Стили для меток
      row.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF374151' } };
      row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
      
      // Стили для значений с цветовым кодированием
      const colors = ['FF3B82F6', 'FF10B981', 'FFF59E0B'];
      row.getCell(2).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
      row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors[index] } };
      row.getCell(2).alignment = { horizontal: 'center' };
      
      // Стили для иконок
      row.getCell(3).font = { size: 12 };
      row.getCell(3).alignment = { horizontal: 'center' };
      
      // Границы для карточек
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
      });
    });
    
    // Пустая строка
    worksheet.addRow([]);
    
    // Заголовок таблицы с современным стилем
    
    const tableTitleRow = worksheet.addRow(['Результаты по предметам:']);
    tableTitleRow.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
    tableTitleRow.height = 28;
    tableTitleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    tableTitleRow.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.mergeCells('A12:I12');
    
    // Добавляем границы для заголовка таблицы
    tableTitleRow.getCell(1).border = {
      top: { style: 'thin', color: { argb: 'FF2563EB' } },
      bottom: { style: 'thin', color: { argb: 'FF2563EB' } },
      left: { style: 'thin', color: { argb: 'FF2563EB' } },
      right: { style: 'thin', color: { argb: 'FF2563EB' } }
    };
    
    // Пустая строка
    worksheet.addRow([]);
    
    // Заголовки таблицы с улучшенным дизайном
    const headerRow = worksheet.addRow(['Предмет', 'Средний балл', 'Качество знаний', 'Успеваемость', 'Всего оценок', 'Оценок 5', 'Оценок 4', 'Оценок 3', 'Оценок 2']);
    headerRow.height = 25;
    headerRow.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    headerRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    headerRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    headerRow.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    headerRow.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    headerRow.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    headerRow.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    headerRow.getCell(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    headerRow.getCell(8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    headerRow.getCell(9).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    
    // Границы для заголовков таблицы
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF1E40AF' } },
        bottom: { style: 'thin', color: { argb: 'FF1E40AF' } },
        left: { style: 'thin', color: { argb: 'FF1E40AF' } },
        right: { style: 'thin', color: { argb: 'FF1E40AF' } }
      };
    });
    
    // Добавляем данные по предметам с цветовым кодированием
    results.subjects.forEach((subject, index) => {
            const totalGrades = subject.grade5 + subject.grade4 + subject.grade3 + subject.grade2;
      const dataRow = worksheet.addRow([
                subject.name || 'Не указан',
        subject.averageGrade || 0,
                `${subject.knowledgeQuality || 0}%`,
                `${subject.performance || 0}%`,
        totalGrades,
        subject.grade5,
        subject.grade4,
        subject.grade3,
        subject.grade2
      ]);
      dataRow.height = 22;
      
      // Стили для названия предмета
      dataRow.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF374151' } };
      dataRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
      
      // Стили для показателей с цветовым кодированием
      const indicatorColors = ['FF3B82F6', 'FF10B981', 'FFF59E0B'];
      for (let i = 2; i <= 4; i++) {
        dataRow.getCell(i).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
        dataRow.getCell(i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: indicatorColors[i-2] } };
        dataRow.getCell(i).alignment = { horizontal: 'center' };
      }
      
      // Стили для общего количества
      dataRow.getCell(5).font = { bold: true, size: 11, color: { argb: 'FF374151' } };
      dataRow.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
      dataRow.getCell(5).alignment = { horizontal: 'center' };
      
      // Стили для количества оценок с цветовым кодированием
      const gradeColors = ['FF10B981', 'FF3B82F6', 'FFF59E0B', 'FFEF4444'];
      for (let i = 6; i <= 9; i++) {
        dataRow.getCell(i).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
        dataRow.getCell(i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: gradeColors[i-6] } };
        dataRow.getCell(i).alignment = { horizontal: 'center' };
      }
      
      // Современные границы
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
      });
    });
    
    // Границы для заголовков таблицы
   // headerRow.eachCell((cell) => {
   //   cell.border = {
   //     top: { style: 'thin', color: { argb: 'FF1E40AF' } },
   //     bottom: { style: 'thin', color: { argb: 'FF1E40AF' } },
   //     left: { style: 'thin', color: { argb: 'FF1E40AF' } },
   //     right: { style: 'thin', color: { argb: 'FF1E40AF' } }
   //   };
   // });
    
    // Добавляем итоговую строку
    const totalGrades = results.subjects.reduce((sum, subject) => 
      sum + subject.grade5 + subject.grade4 + subject.grade3 + subject.grade2, 0
    );
    const totalRow = worksheet.addRow([
      'ИТОГО ПО КЛАССУ:',
      (results.overallAverage).toFixed(2),
      `${results.overallQuality.toFixed(1)}%`,
      `${results.overallPerformance.toFixed(1)}%`,
      totalGrades,
      results.subjects.reduce((sum, s) => sum + s.grade5, 0),
      results.subjects.reduce((sum, s) => sum + s.grade4, 0),
      results.subjects.reduce((sum, s) => sum + s.grade3, 0),
      results.subjects.reduce((sum, s) => sum + s.grade2, 0)
    ]);
    totalRow.height = 25;
    
    // Стили для итоговой строки
    for (let i = 1; i <= 9; i++) {
      totalRow.getCell(i).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
      totalRow.getCell(i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
      totalRow.getCell(i).alignment = { horizontal: 'center' };
      
      // Границы для итоговой строки
      totalRow.getCell(i).border = {
        top: { style: 'medium', color: { argb: 'FF2563EB' } },
        bottom: { style: 'medium', color: { argb: 'FF2563EB' } },
        left: { style: 'medium', color: { argb: 'FF2563EB' } },
        right: { style: 'medium', color: { argb: 'FF2563EB' } }
      };
    }
    
    // Сохраняем файл
    const fileName = results.className ? `${results.className}_отчет_класса.xlsx` : 'отчет_по_классу.xlsx';
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Анализ по классу
          </CardTitle>
          <CardDescription>
            Комплексный анализ успеваемости по всем предметам в классе
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="className">Название класса</Label>
                <Input
                  id="className"
                  value={className}
                  onChange={(e) => {
                    setClassName(e.target.value);
                    localStorage.setItem('className', e.target.value);
                  }}
                  placeholder="Например: 10А"
                />
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Предметы</h3>
            <Button onClick={addSubject} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Добавить предмет
            </Button>
          </div>

          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <Card key={subject.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                  <div>
                    <Label>Название предмета</Label>
                    <Input
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                      placeholder="Предмет"
                    />
                  </div>
                  <div>
                    <Label>Кол-во уч-ся</Label>
                    <Input
                      type="number"
                      value={subject.studentCount === 0 ? '' : subject.studentCount}
                      onChange={(e) => updateSubject(subject.id, 'studentCount', parseInt(e.target.value) || 0)}
                      onFocus={() => handleNumericInputFocus(subject.id, 'studentCount', subject.studentCount)}
                      onBlur={(e) => handleNumericInputBlur(subject.id, 'studentCount', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Оценок "5"</Label>
                    <Input
                      type="number"
                      value={subject.grade5 === 0 ? '' : subject.grade5}
                      onChange={(e) => updateSubject(subject.id, 'grade5', parseInt(e.target.value) || 0)}
                      onFocus={() => handleNumericInputFocus(subject.id, 'grade5', subject.grade5)}
                      onBlur={(e) => handleNumericInputBlur(subject.id, 'grade5', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Оценок "4"</Label>
                    <Input
                      type="number"
                      value={subject.grade4 === 0 ? '' : subject.grade4}
                      onChange={(e) => updateSubject(subject.id, 'grade4', parseInt(e.target.value) || 0)}
                      onFocus={() => handleNumericInputFocus(subject.id, 'grade4', subject.grade4)}
                      onBlur={(e) => handleNumericInputBlur(subject.id, 'grade4', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Оценок "3"</Label>
                    <Input
                      type="number"
                      value={subject.grade3 === 0 ? '' : subject.grade3}
                      onChange={(e) => updateSubject(subject.id, 'grade3', parseInt(e.target.value) || 0)}
                      onFocus={() => handleNumericInputFocus(subject.id, 'grade3', subject.grade3)}
                      onBlur={(e) => handleNumericInputBlur(subject.id, 'grade3', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Оценок "2"</Label>
                    <Input
                      type="number"
                      value={subject.grade2 === 0 ? '' : subject.grade2}
                      onChange={(e) => updateSubject(subject.id, 'grade2', parseInt(e.target.value) || 0)}
                      onFocus={() => handleNumericInputFocus(subject.id, 'grade2', subject.grade2)}
                      onBlur={(e) => handleNumericInputBlur(subject.id, 'grade2', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSubject(subject.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {subjects.length > 0 && (
            <Button onClick={calculateClassMetrics} className="w-full">
              Рассчитать показатели класса
            </Button>
          )}
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center gap-2">
                Общие показатели класса
              </CardTitle>
              {results.className && <CardDescription>Класс: {results.className}</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Средний балл по классу</div>
                  <div className="text-3xl font-bold text-blue-600">{results.overallAverage}</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Качество знаний по классу</div>
                  <div className="text-3xl font-bold text-green-600">{results.overallQuality}%</div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Успеваемость по классу</div>
                  <div className="text-3xl font-bold text-orange-600">{results.overallPerformance}%</div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={downloadXLSX} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                  Скачать XLSX
              </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Результаты по предметам</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Предмет</TableHead>
                    <TableHead>Средний балл</TableHead>
                    <TableHead>Качество знаний</TableHead>
                    <TableHead>Успеваемость</TableHead>
                    <TableHead>Всего оценок</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.name || 'Не указан'}</TableCell>
                      <TableCell>{subject.averageGrade || 0}</TableCell>
                      <TableCell>{subject.knowledgeQuality || 0}%</TableCell>
                      <TableCell>{subject.performance || 0}%</TableCell>
                      <TableCell>
                        {subject.grade5 + subject.grade4 + subject.grade3 + subject.grade2}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Сравнение предметов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#3B82F6" name="Средний балл" />
                  <Bar dataKey="quality" fill="#10B981" name="Качество знаний (%)" />
                  <Bar dataKey="performance" fill="#F59E0B" name="Успеваемость (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClassCalculator;
