import { useState, useEffect } from 'react';
import { Calculator, BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

interface GradeData {
  grade5: number;
  grade4: number;
  grade3: number;
  grade2: number;
}

interface Results {
  averageGrade: number;
  knowledgeQuality: number;
  performance: number;
  totalStudents: number;
}

const SubjectCalculator = () => {
  const [subjectName, setSubjectName] = useState(() => 
    localStorage.getItem('subjectName') || ''
  );
  const [studentCount, setStudentCount] = useState(() => 
    localStorage.getItem('studentCount') || ''
  );
  const [grades, setGrades] = useState<GradeData>(() => {
    const saved = localStorage.getItem('subjectGrades');
    return saved ? JSON.parse(saved) : {
      grade5: 0,
      grade4: 0,
      grade3: 0,
      grade2: 0
    };
  });
  const [results, setResults] = useState<Results | null>(null);

  const handleGradeInputFocus = (field: keyof GradeData) => {
    if (grades[field] === 0) {
      setGrades(prev => ({ ...prev, [field]: '' as any }));
    }
  };

  const handleGradeInputBlur = (field: keyof GradeData, value: string) => {
    const numValue = parseInt(value) || 0;
    setGrades(prev => ({ ...prev, [field]: numValue }));
  };

  const handleStudentCountFocus = () => {
    if (studentCount === '0') {
      setStudentCount('');
    }
  };

  const handleStudentCountBlur = (value: string) => {
    if (value === '') {
      setStudentCount('0');
    }
  };

  const calculateMetrics = () => {
    const totalGrades = grades.grade5 + grades.grade4 + grades.grade3 + grades.grade2;
    const studentCountNum = parseInt(studentCount) || 0;
    
    if (totalGrades === 0) {
      alert('Ошибка: Введите хотя бы одну оценку!');
      return;
    }
    
    if (studentCountNum === 0) {
      alert('Ошибка: Введите количество учеников!');
      return;
    }
    
    if (totalGrades !== studentCountNum) {
      alert(`Ошибка: Количество учеников (${studentCountNum}) не совпадает с общим количеством оценок (${totalGrades})!`);
      return;
    }

    const weightedSum = (grades.grade5 * 5) + (grades.grade4 * 4) + (grades.grade3 * 3) + (grades.grade2 * 2);
    const averageGrade = weightedSum / totalGrades;
    const qualityGrades = grades.grade5 + grades.grade4;
    const knowledgeQuality = (qualityGrades / totalGrades) * 100;
    const performanceGrades = grades.grade5 + grades.grade4 + grades.grade3;
    const performance = (performanceGrades / totalGrades) * 100;

    // Сохраняем данные в localStorage
    localStorage.setItem('subjectName', subjectName);
    localStorage.setItem('studentCount', studentCount);
    localStorage.setItem('subjectGrades', JSON.stringify(grades));

    setResults({
      averageGrade: parseFloat(averageGrade.toFixed(2)),
      knowledgeQuality: parseFloat(knowledgeQuality.toFixed(1)),
      performance: parseFloat(performance.toFixed(1)),
      totalStudents: studentCountNum
    });
  };



  const downloadXLSX = async () => {
    if (!results) return;
    
    // Создаем новую рабочую книгу ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Отчет по предмету');
    
    // Настройки ширины колонок
    worksheet.columns = [
      { header: '', key: 'count', width: 18 },
      { header: 'Количество', key: 'count', width: 18 },
      { header: 'Процент от общего числа', key: 'percentage', width: 22 }
    ];
    
    // Добавляем заголовок с градиентным эффектом
    const titleRow = worksheet.addRow(['EduMetrics - Отчет по предмету']);
    titleRow.font = { bold: true, size: 18, color: { argb: 'FFFFFFFF' } };
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
    titleRow.height = 35;
    worksheet.mergeCells('A1:C1');
    
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
    
    // Информация о предмете с современным дизайном
    const subjectRow = worksheet.addRow(['Предмет:', subjectName || 'Не указан']);
    subjectRow.font = { bold: true, size: 14, color: { argb: 'FF2563EB' } };
    subjectRow.height = 25;
    subjectRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } };
    subjectRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    worksheet.mergeCells('A2:C2');
    
    // Добавляем границы для секции предмета
    subjectRow.getCell(1).border = {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
    };
    
    // Информация о количестве учеников
    const studentsRow = worksheet.addRow(['Колл. учеников:', results.totalStudents]);
    studentsRow.font = { bold: true, size: 14, color: { argb: 'FF2563EB' } };
    studentsRow.height = 25;
    studentsRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4F8' } };
    studentsRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    worksheet.mergeCells('A3:C3');
    
    // Добавляем границы для секции количества учеников
    studentsRow.getCell(1).border = {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
    };
    
    // Пустая строка
    worksheet.addRow([]);
    
    // Основные показатели с карточным дизайном
    const indicatorsRow = worksheet.addRow(['Основные показатели:']);
    indicatorsRow.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
    indicatorsRow.height = 28;
    indicatorsRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    indicatorsRow.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.mergeCells('A7:C7');
  
    // Данные показателей с цветовым кодированием
    const metricsData = [
      ['Средний балл:', results.averageGrade, '📊'],
      ['Качество знаний:', `${results.knowledgeQuality}%`, '📈'],
      ['Успеваемость:', `${results.performance}%`, '🎯'],
      ['Всего оценок:', grades.grade5 + grades.grade4 + grades.grade3 + grades.grade2, '📋']
    ];
    
    metricsData.forEach((data, index) => {
      const row = worksheet.addRow(data);
      row.height = 22;
      
      // Стили для меток
      row.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF374151' } };
      row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
      
      // Стили для значений с цветовым кодированием
      const colors = ['FF3B82F6', 'FF10B981', 'FFF59E0B', 'FF8B5CF6'];
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
    const tableTitleRow = worksheet.addRow(['Распределение оценок:']);
    tableTitleRow.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
    tableTitleRow.height = 28;
    tableTitleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    tableTitleRow.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.mergeCells('A13:C13');
    
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
    const headerRow = worksheet.addRow(['Оценка', 'Количество', 'Процент от общего числа']);
    headerRow.height = 25;
    headerRow.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    headerRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    headerRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    headerRow.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
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
    
    // Добавляем данные по оценкам с цветовым кодированием
    const totalGrades = grades.grade5 + grades.grade4 + grades.grade3 + grades.grade2;
    const gradeData = [
      ['5 (Отлично)', grades.grade5, `${((grades.grade5 / totalGrades) * 100).toFixed(1)}%`],
      ['4 (Хорошо)', grades.grade4, `${((grades.grade4 / totalGrades) * 100).toFixed(1)}%`],
      ['3 (Удовлетворительно)', grades.grade3, `${((grades.grade3 / totalGrades) * 100).toFixed(1)}%`],
      ['2 (Неудовлетворительно)', grades.grade2, `${((grades.grade2 / totalGrades) * 100).toFixed(1)}%`]
    ];
    
    const gradeColors = ['FF10B981', 'FF3B82F6', 'FFF59E0B', 'FFEF4444'];
    
    gradeData.forEach((data, index) => {
      const dataRow = worksheet.addRow(data);
      dataRow.height = 22;
      
      // Стили для названий оценок
      dataRow.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF374151' } };
      dataRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
      
      // Стили для количества с цветовым кодированием
      dataRow.getCell(2).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
      dataRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: gradeColors[index] } };
      dataRow.getCell(2).alignment = { horizontal: 'center' };
      
      // Стили для процентов
      dataRow.getCell(3).font = { size: 11, color: { argb: 'FF6B7280' } };
      dataRow.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
      dataRow.getCell(3).alignment = { horizontal: 'center' };
      
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
    //  cell.border = {
    //   top: { style: 'thin', color: { argb: 'FF1E40AF' } },
    //    bottom: { style: 'thin', color: { argb: 'FF1E40AF' } },
    //   left: { style: 'thin', color: { argb: 'FF1E40AF' } },
    //    right: { style: 'thin', color: { argb: 'FF1E40AF' } }
    //  };
    //});
    
    // Добавляем итоговую строку
    const totalRow = worksheet.addRow(['ИТОГО:', totalGrades, '100%']);
    totalRow.height = 25;
    totalRow.getCell(1).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    totalRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    totalRow.getCell(2).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    totalRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    totalRow.getCell(2).alignment = { horizontal: 'center' };
    totalRow.getCell(3).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    totalRow.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    totalRow.getCell(3).alignment = { horizontal: 'center' };
    
    // Границы для итоговой строки
    totalRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'medium', color: { argb: 'FF2563EB' } },
        bottom: { style: 'medium', color: { argb: 'FF2563EB' } },
        left: { style: 'medium', color: { argb: 'FF2563EB' } },
        right: { style: 'medium', color: { argb: 'FF2563EB' } }
      };
    });
    
    // Сохраняем файл
    const fileName = subjectName ? `${subjectName}_отчет.xlsx` : 'отчет_по_предмету.xlsx';
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName);
  };

  const pieData = results ? [
    { name: 'Отлично (5)', value: grades.grade5, color: '#10B981' },
    { name: 'Хорошо (4)', value: grades.grade4, color: '#3B82F6' },
    { name: 'Удовлетворительно (3)', value: grades.grade3, color: '#F59E0B' },
    { name: 'Неудовлетворительно (2)', value: grades.grade2, color: '#EF4444' }
  ] : [];

  const performanceData = results ? [
    { name: 'Средний балл', value: results.averageGrade, color: '#3B82F6' },
    { name: 'Качество знаний (%)', value: results.knowledgeQuality, color: '#10B981' },
    { name: 'Успеваемость (%)', value: results.performance, color: '#F59E0B' }
  ] : [];

  const barData = results ? [
    { grade: '5', count: grades.grade5, color: '#10B981' },
    { grade: '4', count: grades.grade4, color: '#3B82F6' },
    { grade: '3', count: grades.grade3, color: '#F59E0B' },
    { grade: '2', count: grades.grade2, color: '#EF4444' }
  ] : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Расчёт по предмету
          </CardTitle>
          <CardDescription>
            Введите данные для расчёта среднего балла и качества знаний
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject">Название предмета</Label>
              <Input
                id="subject"
                value={subjectName}
                onChange={(e) => {
                  setSubjectName(e.target.value);
                  localStorage.setItem('subjectName', e.target.value);
                }}
                placeholder="Например: Математика"
              />
            </div>
            <div>
              <Label htmlFor="students">Количество учащихся</Label>
              <Input
                id="students"
                type="number"
                value={studentCount}
                onChange={(e) => {
                  setStudentCount(e.target.value);
                  localStorage.setItem('studentCount', e.target.value);
                }}
                onFocus={handleStudentCountFocus}
                onBlur={(e) => handleStudentCountBlur(e.target.value)}
                placeholder="Введите количество"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="grade5">Оценок "5"</Label>
              <Input
                id="grade5"
                type="number"
                value={grades.grade5 === 0 ? '' : grades.grade5}
                onChange={(e) => {
                  const newGrades = { ...grades, grade5: parseInt(e.target.value) || 0 };
                  setGrades(newGrades);
                  localStorage.setItem('subjectGrades', JSON.stringify(newGrades));
                }}
                onFocus={() => handleGradeInputFocus('grade5')}
                onBlur={(e) => handleGradeInputBlur('grade5', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="grade4">Оценок "4"</Label>
              <Input
                id="grade4"
                type="number"
                value={grades.grade4 === 0 ? '' : grades.grade4}
                onChange={(e) => {
                  const newGrades = { ...grades, grade4: parseInt(e.target.value) || 0 };
                  setGrades(newGrades);
                  localStorage.setItem('subjectGrades', JSON.stringify(newGrades));
                }}
                onFocus={() => handleGradeInputFocus('grade4')}
                onBlur={(e) => handleGradeInputBlur('grade4', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="grade3">Оценок "3"</Label>
              <Input
                id="grade3"
                type="number"
                value={grades.grade3 === 0 ? '' : grades.grade3}
                onChange={(e) => {
                  const newGrades = { ...grades, grade3: parseInt(e.target.value) || 0 };
                  setGrades(newGrades);
                  localStorage.setItem('subjectGrades', JSON.stringify(newGrades));
                }}
                onFocus={() => handleGradeInputFocus('grade3')}
                onBlur={(e) => handleGradeInputBlur('grade3', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="grade2">Оценок "2"</Label>
              <Input
                id="grade2"
                type="number"
                value={grades.grade2 === 0 ? '' : grades.grade2}
                onChange={(e) => {
                  const newGrades = { ...grades, grade2: parseInt(e.target.value) || 0 };
                  setGrades(newGrades);
                  localStorage.setItem('subjectGrades', JSON.stringify(newGrades));
                }}
                onFocus={() => handleGradeInputFocus('grade2')}
                onBlur={(e) => handleGradeInputBlur('grade2', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <Button onClick={calculateMetrics} className="w-full">
            Рассчитать показатели
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center justify-between">
                Результаты расчёта
                <div className="flex gap-2">
                  <Button onClick={downloadXLSX} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Скачать XLSX
                  </Button>
                </div>
              </CardTitle>
              {subjectName && <CardDescription>Предмет: {subjectName}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Средний балл</div>
                <div className="text-3xl font-bold text-blue-600">{results.averageGrade}</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Качество знаний</div>
                <div className="text-3xl font-bold text-green-600">{results.knowledgeQuality}%</div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Успеваемость</div>
                <div className="text-3xl font-bold text-orange-600">{results.performance}%</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Всего оценок</div>
                <div className="text-3xl font-bold text-purple-600">
                  {grades.grade5 + grades.grade4 + grades.grade3 + grades.grade2}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Распределение оценок
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${value}` : ''}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Показатели успеваемости</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Гистограмма оценок</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SubjectCalculator;
