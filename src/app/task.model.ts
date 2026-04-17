export interface Task {
  id: number;
  title: string;
  category: 'Trabalho' | 'Pessoal';
  completed: boolean;
}

export const MOCK_TASKS: Task[] = [
  { id: 1, title: 'Reunião de Alinhamento', category: 'Trabalho', completed: false },
  { id: 2, title: 'Comprar pão', category: 'Pessoal', completed: true },
  { id: 3, title: 'Finalizar relatório', category: 'Trabalho', completed: false }
];
