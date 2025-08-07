
import { useState } from 'react';
import { Calculator, Users, BookOpen, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubjectCalculator from '@/components/SubjectCalculator';
import ClassCalculator from '@/components/ClassCalculator';
import pencilMascot from '@/assets/pencil-mascot.png';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center shadow-lg">
              <img src={pencilMascot} alt="EduMetrics Mascot" className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            EduMetrics
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Инструмент для расчёта среднего балла и качества знаний учащихся
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border-2 h-12">
            <TabsTrigger value="home" className="flex items-center gap-2 text-primary data-[state=active]:bg-accent data-[state=active]:text-white">
              <BookOpen className="w-4 h-4" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="subject" className="flex items-center gap-2 text-primary data-[state=active]:bg-accent data-[state=active]:text-white">
              <Calculator className="w-4 h-4" />
              По предмету
            </TabsTrigger>
            <TabsTrigger value="class" className="flex items-center gap-2 text-primary data-[state=active]:bg-secondary data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              По классу
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card 
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-accent/20 group" 
                onClick={() => setActiveTab('subject')}
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Calculator className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-primary text-2xl mb-2">Анализ по предмету</CardTitle>
                      <CardDescription className="text-muted-foreground text-base">
                        Рассчитайте средний балл и качество знаний для конкретного предмета
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full text-white font-medium rounded-xl h-14 text-lg" 
                    style={{ 
                      background: 'var(--gradient-primary)',
                      border: 'none'
                    }}
                  >
                    Начать расчет
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-secondary/20 group" 
                onClick={() => setActiveTab('class')}
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <Users className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-primary text-2xl mb-2">Анализ по классу</CardTitle>
                      <CardDescription className="text-muted-foreground text-base">
                        Комплексный анализ успеваемости по всем предметам в классе
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full text-white font-medium rounded-xl h-14 text-lg" 
                    style={{ 
                      background: 'var(--gradient-secondary)',
                      border: 'none'
                    }}
                  >
                    Начать анализ
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card 
              className="border-2 border-primary/10 max-w-4xl mx-auto"
              style={{ boxShadow: 'var(--shadow-soft)' }}
            >
              <CardHeader className="pb-6">
                <CardTitle className="text-primary text-2xl text-center">Преимущества EduMetrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calculator className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-primary mb-3 text-lg">Точные расчёты</h3>
                    <p className="text-muted-foreground">Автоматический расчёт среднего балла и качества знаний</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-primary mb-3 text-lg">Визуализация</h3>
                    <p className="text-muted-foreground">Наглядные диаграммы и графики результатов</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-primary mb-3 text-lg">Удобство</h3>
                    <p className="text-muted-foreground">Простой и интуитивный интерфейс для учителей</p>
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
