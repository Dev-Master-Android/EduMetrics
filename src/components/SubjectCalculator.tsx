
import { useState } from 'react';
import { Calculator, BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
    if (totalGrades === 0) return;

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
      totalStudents: parseInt(studentCount) || totalGrades
    });
  };

  const downloadPDF = () => {
    if (!results) return;

    const doc = new jsPDF();
    
    // Заголовок
    doc.setFontSize(20);
    doc.text('EduMetrics - Отчет по предмету', 20, 20);
    
    if (subjectName) {
      doc.setFontSize(14);
      doc.text(`Предмет: ${subjectName}`, 20, 35);
    }
    
    // Основные показатели
    doc.setFontSize(12);
    doc.text('Основные показатели:', 20, 50);
    doc.text(`Средний балл: ${results.averageGrade}`, 20, 65);
    doc.text(`Качество знаний: ${results.knowledgeQuality}%`, 20, 75);
    doc.text(`Успеваемость: ${results.performance}%`, 20, 85);
    doc.text(`Всего оценок: ${grades.grade5 + grades.grade4 + grades.grade3 + grades.grade2}`, 20, 95);
    
    // Таблица с распределением оценок
    const totalGrades = grades.grade5 + grades.grade4 + grades.grade3 + grades.grade2;
    const tableData = [
      ['Оценка', 'Количество', 'Процент от общего числа'],
      ['5 (Отлично)', grades.grade5.toString(), `${((grades.grade5 / totalGrades) * 100).toFixed(1)}%`],
      ['4 (Хорошо)', grades.grade4.toString(), `${((grades.grade4 / totalGrades) * 100).toFixed(1)}%`],
      ['3 (Удовлетворительно)', grades.grade3.toString(), `${((grades.grade3 / totalGrades) * 100).toFixed(1)}%`],
      ['2 (Неудовлетворительно)', grades.grade2.toString(), `${((grades.grade2 / totalGrades) * 100).toFixed(1)}%`]
    ];

    (doc as any).autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 110,
      theme: 'grid'
    });

    // Сохранение файла
    const fileName = subjectName ? `${subjectName}_отчет.pdf` : 'отчет_по_предмету.pdf';
    doc.save(fileName);
  };

  const pieData = results ? [
    { name: 'Отлично (5)', value: grades.grade5, color: '#10B981' },
    { name: 'Хорошо (4)', value: grades.grade4, color: '#3B82F6' },
    { name: 'Удовлетворительно (3)', value: grades.grade3, color: '#F59E0B' },
    { name: 'Неудовлетворительно (2)', value: grades.grade2, color: '#EF4444' }
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
                <Button onClick={downloadPDF} variant="outline" size="sm" className="ml-2">
                  <Download className="w-4 h-4 mr-2" />
                  Скачать отчёт
                </Button>
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
