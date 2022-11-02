import { Input } from '@/features/common/Input';
import { Spinner } from '@/features/common/Spinner';
import { Text } from '@/features/common/Text';
import { QuestionTableList } from '@/features/workspace/QuestionTableList';
import { QuestionTableListSkeleton } from '@/features/workspace/QuestionTableListSkeleton';
import { MagnifyingGlassIcon, ArrowSmallDownIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'preact/hooks';

const mockQuestions: Question[] = [
  {
    name: 'Porama walker',
    description: 'The hardest path algorithm ever',
    level: 'hard',
    status: 'wait',
    lastSubmitted: new Date(),
  },
  {
    name: 'Keeratikorn Eating',
    description: 'The easiest noodle algorithm',
    level: 'easy',
    status: 'done',
    lastSubmitted: new Date(),
  },
  {
    name: 'Chicken',
    description: 'Need to eat a chicken before code',
    level: 'easy',
    status: 'error',
    lastSubmitted: new Date(),
  },
  {
    name: 'Noodle',
    description: 'Need to eat a chicken before code',
    level: 'medium',
    status: 'todo',
    lastSubmitted: new Date(),
  },
];

export type Question = {
  name: string,
  description: string,
  level: 'easy' | 'medium' | 'hard',
  status: 'todo' | 'wait' | 'error' | 'done',
  lastSubmitted: Date,
};

export const QuestionTable = () => {
  const [questions, setQuestions] = useState<Question[] | null>(null);

  // TODO: real fetch
  useEffect(() => {
    setTimeout(() => {
      setQuestions(mockQuestions);
    }, 1500);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center space-x-4 mb-6">
        <div className="flex flex-row items-center space-x-2">
          <Text color="primary" className="text-2xl font-semibold">Question</Text>
          {questions
            ? <Text color="secondary">({questions.length})</Text>
            : <Spinner className="animate-spin w-5 h-5 text-neutral-400" />
          }
        </div>

        <Input
          type="text"
          icon={<MagnifyingGlassIcon />}
          placeholder="Search by name, description, status"
          className="w-96"
        />
      </div>

      <table className="table-auto text-left">
        <thead className="bg-neutral-50 dark:bg-neutral-900 outline outline-1 outline-neutral-300 dark:outline-neutral-700 rounded-md transition-all ease-in duration-200">
          <tr>
            <th className="flex flex-row items-center space-x-2 px-4 py-2 font-normal text-neutral-400">
              <span>#</span>
              <ArrowSmallDownIcon className="w-4 h-4" />
            </th>
            <th className="w-6/12 px-4 py-2 font-normal text-neutral-400">Question</th>
            <th className="hidden md:table-cell px-4 py-2 font-normal text-neutral-400">Level</th>
            <th className="px-4 py-2 font-normal text-neutral-400">Status</th>
            <th className="hidden md:table-cell px-4 py-2 font-normal text-neutral-400">Last submitted</th>
          </tr>
        </thead>
        <tbody>
          {(!questions) && Array(3).fill(0).map(() => (
            <QuestionTableListSkeleton />
          ))}

          {(questions) && questions.map((question, index) => (
            <QuestionTableList
              key={index}
              index={index}
              name={question.name}
              description={question.description}
              level={question.level}
              status={question.status}
              lastSubmitted={question.lastSubmitted}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};