import { Navbar } from '@/features/common/navbar/Navbar';
import { QuestionTable } from '@/features/workspace/QuestionTable';
import { QuestionTableSkeleton } from '@/features/workspace/skeleton/QuestionTableSkeleton';
import { WorkspaceTopPanel } from '@/features/workspace/WorkspaceTopPanel';
import { WorkspaceTopPanelSkeleton } from '@/features/workspace/skeleton/WorkspaceTopPanelSkeleton';
import { fetch } from '@/utils/Fetch';
import { useEffect, useState } from 'preact/hooks';
import { PublicQuestion, PublicWorkspace } from '@codern/external';
import { toast } from 'react-toastify';
import { Copyright } from '@/features/common/Copyright';

type WorkspacePageProps = {
  workspaceId: string,
};

export const WorkspacePage = ({
  workspaceId,
}: WorkspacePageProps) => {
  const [workspace, setWorkspace] = useState<PublicWorkspace | null>(null);
  const [questions, setQuestions] = useState<PublicQuestion[] | null>(null);

  useEffect(() => {
    let workspaceTimer: number;
    let questionsTimer: number;

    fetch
      .get(`/workspaces/${workspaceId}`)
      .then((response) => {
        workspaceTimer = setTimeout(() => setWorkspace(response.data), 100);
      })
      .catch(() => toast.error('Cannot retrieve workspace data'));

    fetch
      .get(`/workspaces/${workspaceId}/questions`)
      .then((response) => {
        questionsTimer = setTimeout(() => setQuestions(response.data), 100);
      })
      .catch(() => toast.error('Cannot retrieve question data'));

    return () => {
      clearTimeout(workspaceTimer);
      clearTimeout(questionsTimer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col dark:bg-black transition-theme">
      <Navbar />

      <main className="container w-full h-full flex flex-col p-6">
        {workspace
          ? (<WorkspaceTopPanel
              name={workspace.name}
              ownerName={workspace.ownerName}
              profilePath={workspace.profilePath}
            />)
          : (<WorkspaceTopPanelSkeleton />)
        }

        {questions
          ? (<QuestionTable questions={questions} />)
          : (<QuestionTableSkeleton />)
        }
      </main>

      <footer className="w-full mt-auto py-2 text-center border-t border-primary">
        <Copyright />
      </footer>
    </div>
  );
};
