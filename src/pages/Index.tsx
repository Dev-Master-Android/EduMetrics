
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

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-accent rounded-full p-1">
            <Button 
              variant={activeTab === 'home' ? 'default' : 'ghost'} 
              className="rounded-full px-6"
              onClick={() => setActiveTab('home')}
            >
              Главная
            </Button>
            <Button 
              variant={activeTab === 'subject' ? 'default' : 'ghost'} 
              className="rounded-full px-6"
              onClick={() => setActiveTab('subject')}
            >
              Отчёты
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          <TabsContent value="home" className="space-y-8">
            <div className="space-y-6">
              <Card 
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-accent/20" 
                onClick={() => setActiveTab('subject')}
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-primary text-xl">Анализ по предмету</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Рассчитайте средний балл и качество знаний для конкретного предмета
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full text-white font-medium rounded-xl h-12" 
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
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-secondary/20" 
                onClick={() => setActiveTab('class')}
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-primary text-xl">Анализ по классу</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Комплексный анализ успеваемости по всем предметам в классе
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full text-white font-medium rounded-xl h-12" 
                    style={{ 
                      background: 'var(--gradient-secondary)',
                      border: 'none'
                    }}
                  >
                    Начать анализ
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-2 border-primary/10"
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-primary text-xl">Преимущества EduMetrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Calculator className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="font-semibold text-primary mb-2">Точные расчёты</h3>
                      <p className="text-sm text-muted-foreground">Автоматический расчёт среднего балла и качества знаний</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <BarChart3 className="w-6 h-6 text-secondary" />
                      </div>
                      <h3 className="font-semibold text-primary mb-2">Визуализация</h3>
                      <p className="text-sm text-muted-foreground">Наглядные диаграммы и графики результатов</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-primary mb-2">Удобство</h3>
                      <p className="text-sm text-muted-foreground">Простой и интуитивный интерфейс для учителей</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subject">
            <div className="grid md:grid-cols-2 gap-6">
              <Card style={{ boxShadow: 'var(--shadow-soft)' }}>
                <CardContent className="p-6">
                  <SubjectCalculator />
                </CardContent>
              </Card>
              <Card style={{ boxShadow: 'var(--shadow-soft)' }}>
                <CardContent className="p-6">
                  <ClassCalculator />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
