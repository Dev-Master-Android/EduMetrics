
import { useState } from 'react';
import { Calculator, Users, BookOpen, BarChart3, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SubjectCalculator from '@/components/SubjectCalculator';
import ClassCalculator from '@/components/ClassCalculator';
import pencilMascot from '@/assets/pencil-mascot.png';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 stagger-item">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center shadow-lg overflow-hidden pulse-glow logo-bounce">
              <img src={pencilMascot} alt="EduMetrics Mascot" className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-primary mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            EduMetrics
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Инструмент для расчёта среднего балла и качества знаний учащихся
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full stagger-item">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border-2 h-12 sm:h-14 md:h-16 lg:h-20 rounded-2xl p-1 sm:p-2 shadow-lg">
            <TabsTrigger 
              value="home" 
              className="flex items-center gap-1 sm:gap-2 text-primary data-[state=active]:bg-accent data-[state=active]:text-white transition-all duration-300 rounded-xl hover:scale-105 data-[state=active]:shadow-lg px-1 sm:px-2"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base lg:text-lg font-medium hidden xs:inline">Главная</span>
              <span className="text-xs font-medium xs:hidden">Гл.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="subject" 
              className="flex items-center gap-1 sm:gap-2 text-primary data-[state=active]:bg-accent data-[state=active]:text-white transition-all duration-300 rounded-xl hover:scale-105 data-[state=active]:shadow-lg px-1 sm:px-2"
            >
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base lg:text-lg font-medium hidden sm:inline">Отчет по предмету</span>
              <span className="text-xs font-medium sm:hidden">Предмет</span>
            </TabsTrigger>
            <TabsTrigger 
              value="class" 
              className="flex items-center gap-1 sm:gap-2 text-primary data-[state=active]:bg-secondary data-[state=active]:text-white transition-all duration-300 rounded-xl hover:scale-105 data-[state=active]:shadow-lg px-1 sm:px-2"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base lg:text-lg font-medium hidden sm:inline">Отчет по классу</span>
              <span className="text-xs font-medium sm:hidden">Класс</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="tab-content space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto px-4">
              <Card 
                className="card-hover cursor-pointer border-2 border-transparent hover:border-accent/30 group stagger-item rounded-3xl overflow-hidden" 
                onClick={() => setActiveTab('subject')}
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <CardHeader className="pb-4 sm:pb-6 md:pb-8 p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent/20 to-accent/30 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <Calculator className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
                    </div>
                    <div className="text-center sm:text-left">
                      <CardTitle className="text-primary text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 group-hover:text-accent transition-colors">Анализ по предмету</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                        Рассчитайте средний балл и качество знаний для конкретного предмета
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 md:p-8 pt-0">
                  <Button 
                    className="w-full text-white font-semibold rounded-2xl h-12 sm:h-14 md:h-16 text-base sm:text-lg md:text-xl btn-shimmer group-hover:scale-105 transition-all duration-300" 
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
                className="card-hover cursor-pointer border-2 border-transparent hover:border-secondary/30 group stagger-item rounded-3xl overflow-hidden" 
                onClick={() => setActiveTab('class')}
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <CardHeader className="pb-4 sm:pb-6 md:pb-8 p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-secondary/20 to-secondary/30 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <Users className="w-8 h-8 sm:w-10 sm:h-10 text-secondary" />
                    </div>
                    <div className="text-center sm:text-left">
                      <CardTitle className="text-primary text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 group-hover:text-secondary transition-colors">Анализ по классу</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                        Комплексный анализ успеваемости по всем предметам в классе
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 md:p-8 pt-0">
                  <Button 
                    className="w-full text-white font-semibold rounded-2xl h-12 sm:h-14 md:h-16 text-base sm:text-lg md:text-xl btn-shimmer group-hover:scale-105 transition-all duration-300" 
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
              className="border-2 border-primary/10 max-w-6xl mx-auto rounded-3xl stagger-item card-hover"
              style={{ boxShadow: 'var(--shadow-soft)' }}
            >
              <CardHeader className="pb-4 sm:pb-6 md:pb-8 p-4 sm:p-6 md:p-8">
                <CardTitle className="text-primary text-2xl sm:text-3xl md:text-4xl text-center mb-2 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Преимущества EduMetrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 md:p-8 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="text-center stagger-item group hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent/20 to-accent/30 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-all duration-300">
                          <Calculator className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
                        </div>
                        <h3 className="font-bold text-primary mb-2 sm:mb-4 text-lg sm:text-xl md:text-2xl group-hover:text-accent transition-colors flex items-center justify-center gap-2">
                          Точные расчёты
                          <Info className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
                        </h3>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">Автоматический расчёт среднего балла и качества знаний</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-accent flex items-center gap-3">
                          <Calculator className="w-8 h-8" />
                          Точные расчёты
                        </DialogTitle>
                        <DialogDescription className="text-lg leading-relaxed mt-4">
                          <p className="mb-4">
                            EduMetrics использует проверенные математические формулы для точного расчёта успеваемости:
                          </p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Средний балл:</strong> Сумма всех оценок разделённая на количество оценок</li>
                            <li><strong>Качество знаний:</strong> Процент учащихся с оценками "4" и "5"</li>
                            <li><strong>Успеваемость:</strong> Процент учащихся без оценки "2"</li>
                            <li><strong>СОУ (Степень обученности учащихся):</strong> Комплексный показатель качества образования</li>
                          </ul>
                          <p className="mt-4">
                            Все расчёты выполняются автоматически с максимальной точностью, исключая возможность ошибок при ручном подсчёте.
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="text-center stagger-item group hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-secondary/20 to-secondary/30 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-all duration-300">
                          <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-secondary" />
                        </div>
                        <h3 className="font-bold text-primary mb-2 sm:mb-4 text-lg sm:text-xl md:text-2xl group-hover:text-secondary transition-colors flex items-center justify-center gap-2">
                          Визуализация
                          <Info className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
                        </h3>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">Наглядные диаграммы и графики результатов</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-secondary flex items-center gap-3">
                          <BarChart3 className="w-8 h-8" />
                          Визуализация данных
                        </DialogTitle>
                        <DialogDescription className="text-lg leading-relaxed mt-4">
                          <p className="mb-4">
                            Результаты анализа представлены в удобном графическом виде:
                          </p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Круговые диаграммы:</strong> Распределение оценок по предметам</li>
                            <li><strong>Столбчатые графики:</strong> Сравнение показателей между классами</li>
                            <li><strong>Таблицы:</strong> Детальная статистика в структурированном виде</li>
                            <li><strong>Цветовое кодирование:</strong> Быстрая оценка критических показателей</li>
                            <li><strong>Экспорт отчётов:</strong> Сохранение в PDF и Excel форматах</li>
                          </ul>
                          <p className="mt-4">
                            Визуальное представление данных помогает учителям и администрации быстро выявлять тенденции и принимать обоснованные решения.
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="text-center stagger-item group hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/30 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-all duration-300">
                          <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                        </div>
                        <h3 className="font-bold text-primary mb-2 sm:mb-4 text-lg sm:text-xl md:text-2xl group-hover:text-primary transition-colors flex items-center justify-center gap-2">
                          Удобство
                          <Info className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
                        </h3>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">Простой и интуитивный интерфейс для учителей</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-primary flex items-center gap-3">
                          <Users className="w-8 h-8" />
                          Удобство использования
                        </DialogTitle>
                        <DialogDescription className="text-lg leading-relaxed mt-4">
                          <p className="mb-4">
                            EduMetrics разработан с учётом потребностей педагогов:
                          </p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Интуитивный интерфейс:</strong> Минимальное время на освоение системы</li>
                            <li><strong>Быстрый ввод данных:</strong> Удобные формы для массового ввода оценок</li>
                            <li><strong>Автосохранение:</strong> Данные сохраняются автоматически</li>
                            <li><strong>Мобильная версия:</strong> Работа с любого устройства</li>
                            <li><strong>Справочная система:</strong> Встроенная помощь и подсказки</li>
                            <li><strong>Настройка под школу:</strong> Адаптация под особенности учебного процесса</li>
                          </ul>
                          <p className="mt-4">
                            Система экономит время учителей, позволяя сосредоточиться на образовательном процессе, а не на рутинных расчётах.
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subject" className="tab-content">
            <SubjectCalculator />
          </TabsContent>

          <TabsContent value="class" className="tab-content">
            <ClassCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
