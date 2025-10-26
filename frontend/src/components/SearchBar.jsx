import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, User, GraduationCap, Briefcase } from 'lucide-react';
import { searchIndex } from '../data/mockData.js';

const typeIconMap = {
  Freelancer: User,
  Course: GraduationCap,
  Job: Briefcase
};

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return searchIndex.slice(0, 5);
    }
    return searchIndex
      .filter((item) => item.label.toLowerCase().includes(normalized))
      .slice(0, 6);
  }, [query]);

  const showDropdown = focused && suggestions.length > 0;

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="group relative flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-3 shadow-lg shadow-primary-500/5 transition focus-within:border-primary-400 focus-within:shadow-primary-500/20 dark:border-slate-700 dark:bg-night/70">
        <Search className="h-5 w-5 text-primary-500" aria-hidden />
        <input
          type="text"
          placeholder="Search for freelancers, jobs, or skills…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
          aria-label="Search SkillLink"
        />
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-600"
        >
          <TrendingUp className="h-4 w-4" />
          Quick match
        </button>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full z-20 mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-night/95"
          >
            {suggestions.map((item) => {
              const Icon = typeIconMap[item.type] ?? User;
              return (
                <li
                  key={item.id}
                  className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm text-slate-600 transition last:border-b-0 hover:bg-primary-50/70 hover:text-primary-600 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-primary-500/10 dark:hover:text-primary-200"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 dark:bg-primary-500/15 dark:text-primary-200">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{item.type}</p>
                  </div>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
