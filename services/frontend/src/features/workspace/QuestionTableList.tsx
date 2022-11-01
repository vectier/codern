import { Text } from '@/features/common/Text';
import { Question } from '@/features/workspace/QuestionTable';
import { classNames } from '@/utils/Classes';

type QuestionTableListProps = Question & {
  index: number,
};

export const QuestionTableList = ({
  index,
  name,
  description,
  level,
  status,
  lastSubmitted,
}: QuestionTableListProps) => {
  return (
    <tr className="border-b border-neutral-300 dark:border-neutral-700">
      <td className="px-2 md:px-4 py-4">
        <Text color="secondary">{index}</Text>
      </td>

      <td className="px-2 md:px-4 py-4">
        <Text color="primary" className="font-medium">{name}</Text>
        <Text color="secondary" className="hidden md:block text-sm">{description}</Text>
      </td>

      <td className="hidden md:table-cell px-2 md:px-4 py-4">
        <Text color="secondary">{level}</Text>
      </td>

      <td className="px-2 md:px-4 py-4">
        <div className="flex flex-row items-center space-x-2">
          <div className={classNames(
            'w-2 h-2 rounded-full capitalize',
            (status === 'todo') && 'bg-neutral-500',
            (status === 'wait') && 'bg-yellow-500',
            (status === 'error') && 'bg-red-500',
            (status === 'done') && 'bg-green-500',
          )} />
          <Text color="secondary" className="text-sm md:text-base capitalize">
            {status}
          </Text>
        </div>
      </td>
      
      <td className="hidden md:table-cell px-2 md:px-4 py-4">
        <Text color="secondary">{lastSubmitted.toLocaleDateString('th-TH')}</Text>
      </td>
    </tr>
  );
};
