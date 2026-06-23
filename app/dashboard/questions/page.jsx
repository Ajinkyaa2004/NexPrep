'use client';

import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, Sparkles, Loader2, BookOpen, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { questionBank } from './_data/questionBank';
import { chatSession } from '../../../utils/GeminiAIModal';
import { Button } from '../../../components/ui/button';

export default function QuestionsPage() {
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [openKey, setOpenKey] = useState(null);
  const [aiExtra, setAiExtra] = useState({}); // { [category]: [{q,a}] }
  const [generating, setGenerating] = useState('');

  const categories = ['All', ...questionBank.map((c) => c.category)];

  // Merge curated + AI-generated, then filter by category + search.
  const sections = useMemo(() => {
    const merged = questionBank.map((c) => ({
      ...c,
      questions: [...c.questions, ...(aiExtra[c.category] || [])],
    }));
    const byCat = activeCat === 'All' ? merged : merged.filter((c) => c.category === activeCat);
    if (!search.trim()) return byCat;
    const q = search.toLowerCase();
    return byCat
      .map((c) => ({ ...c, questions: c.questions.filter((it) => it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)) }))
      .filter((c) => c.questions.length > 0);
  }, [activeCat, search, aiExtra]);

  const totalCount = useMemo(
    () => questionBank.reduce((n, c) => n + c.questions.length + (aiExtra[c.category]?.length || 0), 0),
    [aiExtra]
  );

  const generateMore = async (category) => {
    try {
      setGenerating(category);
      const prompt =
        `Generate 5 realistic ${category} interview questions with concise model answers. ` +
        `Return ONLY raw JSON: {"questions":[{"q":"...","a":"..."}]}. Keep each answer 2-3 sentences.`;
      const result = await chatSession.sendMessage(prompt, { temperature: 0.7 });
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const match = text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(match ? match[0] : text);
      const fresh = (parsed.questions || []).filter((x) => x.q && x.a);
      if (!fresh.length) throw new Error('No questions returned');
      setAiExtra((prev) => ({ ...prev, [category]: [...(prev[category] || []), ...fresh] }));
      toast.success(`Added ${fresh.length} AI questions to ${category}`);
    } catch (e) {
      console.error('Generate questions error:', e);
      toast.error('Could not generate questions right now. Please try again.');
    } finally {
      setGenerating('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200/60 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold text-primary tracking-wider uppercase border border-primary/20">
            {totalCount}+ questions
          </span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-primary" /> Question Bank
        </h2>
        <p className="text-gray-500 mt-1 text-sm">Browse curated interview questions with model answers — or generate more with AI.</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/30 max-w-xl">
        <Search className="text-gray-400 w-5 h-5" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions…"
          className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400 bg-transparent"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCat === c
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Sections */}
      {sections.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400">No questions match your search.</p>
        </div>
      ) : (
        sections.map((section) => (
          <section key={section.category} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="font-bold text-gray-800">{section.category}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{section.blurb}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => generateMore(section.category)}
                disabled={generating === section.category}
                className="gap-2 h-9 shrink-0 text-primary border-primary/30 hover:bg-primary/5"
              >
                {generating === section.category ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generating === section.category ? 'Generating…' : 'Generate more'}
              </Button>
            </div>
            <div className="divide-y divide-gray-100">
              {section.questions.map((item, i) => {
                const key = `${section.category}-${i}`;
                const open = openKey === key;
                return (
                  <div key={key}>
                    <button
                      onClick={() => setOpenKey(open ? null : key)}
                      className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800 text-sm">{item.q}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && (
                      <div className="px-4 pb-4">
                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-blue-900 leading-relaxed">{item.a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
