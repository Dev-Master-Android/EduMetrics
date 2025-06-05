
import { useState } from 'react';
import { Calculator, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface GradeData {
  grade5: number;
  grade4: number;
  grade3: number;
  grade2: number;
}

interface Results {
  averageGrade: number;
  knowledgeQuality: number;
  totalStudents: number;
}

const SubjectCalculator = () => {
  const [subjectName, setSubjectName] = useState('');
  const [studentCount, setStudentCount] = useState('');
  const [grades, setGrades] = useState<GradeData>({
    grade5: 0,
    grade4: 0,
    grade3: 0,
    grade2: 0
  });
  const [results, setResults] = useState<Results | null>(null);

  const calculateMetrics = () => {
    const totalGrades = grades.grade5 + grades.grade4 + grades.grade3 + grades.grade2;
    if (totalGrades === 0) return;

    const weightedSum = (grades.grade5 * 5) + (grades.grade4 * 4) + (grades.grade3 * 3) + (grades.grade2 * 2);
    const averageGrade = weightedSum / totalGrades;
    const qualityGrades = grades.grade5 + grades.grade4;
    const knowledgeQuality = (qualityGrades / totalGrades) * 100;

    setResults({
      averageGrade: parseFloat(averageGrade.toFixed(2)),
      knowledgeQuality: parseFloat(knowledgeQuality.toFixed(1)),
      totalStudents: parseInt(studentCount) || totalGrades
    });
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
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Например: Математика"
              />
            </div>
            <div>
              <Label htmlFor="students">Количество учащихся</Label>
              <Input
                id="students"
                type="number"
                value={studentCount}
                onChange={(e) => setStudentCount(e.target.value)}
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
                value={grades.grade5}
                onChange={(e) => setGrades(prev => ({ ...prev, grade5: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="grade4">Оценок "4"</Label>
              <Input
                id="grade4"
                type="number"
                value={grades.grade4}
                onChange={(e) => setGrades(prev => ({ ...prev, grade4: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="grade3">Оценок "3"</Label>
              <Input
                id="grade3"
                type="number"
                value={grades.grade3}
                onChange={(e) => setGrades(prev => ({ ...prev, grade3: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="grade2">Оценок "2"</Label>
              <Input
                id="grade2"
                type="number"
                value={grades.grade2}
                onChange={(e) => setGrades(prev => ({ ...prev, grade2: parseInt(e.target.value) || 0 }))}
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
              <CardTitle className="text-blue-600">Результаты расчёта</CardTitle>
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
