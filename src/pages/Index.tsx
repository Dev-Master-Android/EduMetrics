
import { useState } from 'react';
import { Calculator, Users, BookOpen, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubjectCalculator from '@/components/SubjectCalculator';
import ClassCalculator from '@/components/ClassCalculator';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            <span className="text-blue-600">Edu</span>Metrics
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Инструмент для расчёта среднего балла и качества знаний учащихся
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="subject" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              По предмету
            </TabsTrigger>
            <TabsTrigger value="class" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              По классу
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('subject')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Calculator className="w-6 h-6" />
                    Анализ по предмету
                  </CardTitle>
                  <CardDescription>
                    Рассчитайте средний балл и качество знаний для конкретного предмета
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Начать расчёт
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('class')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Users className="w-6 h-6" />
                    Анализ по классу
                  </CardTitle>
                  <CardDescription>
                    Комплексный анализ успеваемости по всем предметам в классе
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Начать анализ
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Возможности EduMetrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Calculator className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-semibold">Точные расчёты</h3>
                    <p className="text-sm opacity-90">Автоматический расчёт среднего балла и качества знаний</p>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-semibold">Визуализация</h3>
                    <p className="text-sm opacity-90">Наглядные диаграммы и графики результатов</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-semibold">Удобство</h3>
                    <p className="text-sm opacity-90">Простой и интуитивный интерфейс для учителей</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subject">
            <SubjectCalculator />
          </TabsContent>

          <TabsContent value="class">
            <ClassCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
