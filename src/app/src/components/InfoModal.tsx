import { Button } from '@app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { cn } from '@app/lib/utils';
import { BookOpen, Calendar, ExternalLink, GitBranch, MessageCircle } from 'lucide-react';

const links: { icon: React.ReactElement; text: string; href: string }[] = [
  {
    icon: <BookOpen className="size-4" />,
    text: 'Documentation',
    href: 'https://github.com/NETIZEN-11/ARTF/blob/main/README.md',
  },
  {
    icon: <GitBranch className="size-4" />,
    text: 'GitHub Repository',
    href: 'https://github.com/NETIZEN-11/ARTF',
  },
  {
    icon: <MessageCircle className="size-4" />,
    text: 'Contact Developer',
    href: 'mailto:your-email@example.com',
  },
  {
    icon: <Calendar className="size-4" />,
    text: 'GitHub Profile',
    href: 'https://github.com/NETIZEN-11',
  },
];

export default function InfoModal<T extends { open: boolean; onClose: () => void }>({
  open,
  onClose,
}: T) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>About artef</DialogTitle>
          <a
            href="https://github.com/NETIZEN-11/ARTF/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Version {import.meta.env.VITE_artef_VERSION}
          </a>
        </DialogHeader>
        <DialogDescription>
          ARTEF (Agent Red-Teaming & Evaluation Framework) is a MIT licensed open-source tool for
          evaluating and red-teaming LLMs. Forked and customized by NETIZEN-11. Track the
          performance of your models and prompts over time with automated support for dataset
          generation and grading.
        </DialogDescription>
        <div className="flex flex-col gap-3 mt-2">
          {links.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-2 text-sm text-foreground',
                'hover:text-primary transition-colors',
              )}
            >
              {item.icon}
              <span>{item.text}</span>
              <ExternalLink className="size-3 opacity-50 ml-auto" />
            </a>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
