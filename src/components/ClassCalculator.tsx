import { useState } from 'react';
import { Plus, Trash2, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
}

interface ClassResults {
  className: string;
  subjects: SubjectGrades[];
  overallAverage: number;
  overallQuality: number;
}

const ClassCalculator = () => {
  const [className, setClassName] = useState('');
  const [subjects, setSubjects] = useState<SubjectGrades[]>([]);
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
    setSubjects([...subjects, newSubject]);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const updateSubject = (id: string, field: keyof SubjectGrades, value: string | number) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
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
    const calculatedSubjects = subjects.map(subject => {
      const totalGrades = subject.grade5 + subject.grade4 + subject.grade3 + subject.grade2;
      if (totalGrades === 0) return { ...subject, averageGrade: 0, knowledgeQuality: 0 };

      const weightedSum = (subject.grade5 * 5) + (subject.grade4 * 4) + (subject.grade3 * 3) + (subject.grade2 * 2);
      const averageGrade = weightedSum / totalGrades;
      const qualityGrades = subject.grade5 + subject.grade4;
      const knowledgeQuality = (qualityGrades / totalGrades) * 100;

      return {
        ...subject,
        averageGrade: parseFloat(averageGrade.toFixed(2)),
        knowledgeQuality: parseFloat(knowledgeQuality.toFixed(1))
      };
    });

    const validSubjects = calculatedSubjects.filter(s => s.averageGrade > 0);
    const overallAverage = validSubjects.length > 0 
      ? validSubjects.reduce((sum, s) => sum + s.averageGrade!, 0) / validSubjects.length
      : 0;
    
    const overallQuality = validSubjects.length > 0
      ? validSubjects.reduce((sum, s) => sum + s.knowledgeQuality!, 0) / validSubjects.length
      : 0;

    setResults({
      className,
      subjects: calculatedSubjects,
      overallAverage: parseFloat(overallAverage.toFixed(2)),
      overallQuality: parseFloat(overallQuality.toFixed(1))
    });
  };

  const chartData = results?.subjects.map(subject => ({
    name: subject.name || 'Предмет',
    average: subject.averageGrade || 0,
    quality: subject.knowledgeQuality || 0
  })) || [];

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
              onChange={(e) => setClassName(e.target.value)}
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
              <CardTitle className="text-green-600">Общие показатели класса</CardTitle>
              {results.className && <CardDescription>Класс: {results.className}</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Средний балл по классу</div>
                  <div className="text-3xl font-bold text-blue-600">{results.overallAverage}</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Качество знаний по классу</div>
                  <div className="text-3xl font-bold text-green-600">{results.overallQuality}%</div>
                </div>
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
                    <TableHead>Всего оценок</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.name || 'Не указан'}</TableCell>
                      <TableCell>{subject.averageGrade || 0}</TableCell>
                      <TableCell>{subject.knowledgeQuality || 0}%</TableCell>
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
                  <Bar dataKey="quality" fill="#10B981" name="Качество знаний %" />
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
