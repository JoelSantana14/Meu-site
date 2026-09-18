import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Newspaper,
  Calendar,
  User,
  Tag,
  Search,
  ArrowRight,
  Clock,
  BookOpen,
  X,
  Share2,
  Code
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  summary: string;
  content: string;
}

export const NoticiasMercadoPage: React.FC = () => {
  const { customHtmlBlocks } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const noticiasHtmlBlocks = customHtmlBlocks.filter(b => b.active && (b.position === 'noticias' || b.position === 'custom_page'));

  const articles: Article[] = [
    {
      id: 'selic-financiamento-2026',
      title: 'Taxa Selic e o Impacto Direto nas Prestações do Financiamento Imobiliário',
      category: 'Financiamento',
      readTime: '4 min',
      date: '10 de Setembro, 2026',
      author: 'Joel Santana',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80',
      summary: 'Entenda como a estabilização da taxa de juros favorece a aprovação de cartas de crédito bancárias e reduz o valor da parcela inicial.',
      content: `A manutenção da Taxa Selic em patamares previsíveis no segundo semestre de 2026 trouxe estabilidade para as linhas de crédito imobiliário no Brasil. Bancos como Caixa Econômica Federal, Itaú e Bradesco ajustaram suas taxas médias para financiamento residencial pelo Sistema Financeiro da Habitação (SFH).

### O que muda para quem quer comprar?
1. **Maior Capacidade de Compra**: Com juros controlados, a simulação de renda mensal permite financiar valores maiores com a mesma comprovação de renda.
2. **Portabilidade de Crédito**: Clientes com financiamentos antigos contratados a taxas mais elevadas podem solicitar a portabilidade para contratos mais benéficos.
3. **Uso do FGTS**: O limite para amortização ou entrada utilizando o saldo do FGTS permanece uma das melhores estratégias para reduzir os juros totais ao longo do contrato.`
    },
    {
      id: 'imovel-planta-vs-pronto',
      title: 'Comprar Imóvel na Planta ou Pronto: Guia Definitivo de Vantagens e Riscos',
      category: 'Dicas de Compra',
      readTime: '6 min',
      date: '05 de Setembro, 2026',
      author: 'Joel Santana',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      summary: 'Comparativo detalhado sobre valorização, fluxo de pagamento da construção, reajuste do INCC e facilidades de mudança imediata.',
      content: `Escolher entre um apartamento pronto para morar ou uma unidade em fase de lançamento requer alinhar suas necessidades de tempo e planejamento financeiro.

### Vantagens do Imóvel na Planta:
- **Valorização Térmica**: Historicamente, imóveis na planta valorizam entre 15% e 30% até a entrega das chaves.
- **Fluxo Facilitado**: A entrada pode ser parcelada durante o período de obras diretamente com a construtora.

### Vantagens do Imóvel Pronto:
- **Mudança Imediata**: Ideal para quem precisa sair do aluguel sem ter custo duplo (aluguel + parcelas da obra).
- **Vistoria Presencial**: Você avalia a iluminação natural, ventilação e acabamentos reais antes de comprar.`
    },
    {
      id: 'reajuste-igpm-aluguel',
      title: 'Reajuste de Aluguel em 2026: Quando Usar IGP-M ou IPCA no Contrato',
      category: 'Legislação',
      readTime: '5 min',
      date: '28 de Agosto, 2026',
      author: 'Equipe de Assessoria',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop&q=80',
      summary: 'Saiba como negociar cláusulas de reajuste anual para evitar sobressaltos e manter o valor do aluguel equilibrado.',
      content: `Historicamente, o IGP-M (medido pela FGV) foi o principal indexador de contratos de locação no Brasil. Contudo, a migração para o IPCA (inflação oficial do IBGE) tornou-se cada vez mais frequente em contratos recentes devido à sua maior previsibilidade.

### Dicas para Proprietários e Inquilinos:
- **Acordo Amigável**: A legislação permite que locador e locatário pactuem a troca do índice no momento da renovação anual.
- **Transparência**: Consulte as calculadoras oficiais antes de enviar a notificação de reajuste.`
    },
    {
      id: 'chacaras-interior-sp',
      title: 'Crescimento na Procura por Chácaras e Imóveis Rurais no Interior de SP',
      category: 'Investimentos',
      readTime: '4 min',
      date: '20 de Agosto, 2026',
      author: 'Joel Santana',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
      summary: 'A busca por qualidade de vida e modelo de trabalho híbrido aquece a procura por propriedades com área verde a até 100km da capital.',
      content: `A busca por chácaras de lazer e sítios para refúgio no fim de semana ou moradia definitiva continua em alta acelerada na Região Metropolitana de São Paulo e interior próximo.

Cidades como Sorocaba, Atibaia, Ibiúna e Mairiporã lideram a preferência de famílias que buscam espaço, pomar e área de lazer privativa.`
    }
  ];

  const categories = ['Todos', 'Financiamento', 'Dicas de Compra', 'Legislação', 'Investimentos'];

  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === 'Todos' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || art.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Blog & Insights do Mercado</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Notícias do Mercado Imobiliário
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Fique informado sobre tendências, taxas de juros, dicas jurídicas e orientações para comprar ou vender.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar notícias ou assuntos..."
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white font-medium"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map(art => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-bold text-[10px] uppercase">
                {art.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {art.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {art.readTime}</span>
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Ler Artigo Completo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom HTML Blocks / Partner Sites / Market News Widgets */}
      {noticiasHtmlBlocks.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase tracking-wider">
            <Code className="w-4 h-4" />
            <span>Conteúdos HTML & Sites Parceiros</span>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {noticiasHtmlBlocks.map(block => (
              <div
                key={block.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm overflow-hidden"
              >
                {block.title && (
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
                    {block.title}
                  </h3>
                )}
                <div
                  className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: block.htmlContent }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Article Modal Reader */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 max-w-3xl w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="relative h-64 sm:h-80">
              <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="px-3 py-1 rounded-full bg-indigo-600 font-bold text-[10px] uppercase">
                  {selectedArticle.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black leading-tight">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-300 font-medium">
                  <span>Por {selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.date}</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
              {selectedArticle.content.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Publicado por Assessoria Joel Santana</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all"
              >
                Fechar Artigo
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
