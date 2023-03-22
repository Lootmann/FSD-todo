type TaskType = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  priority: number;
  created_at: Date;
  updated_at: Date;
  expired_at: Date;
  is_done: boolean;
};

type TaskCreateType = {
  title: string;
  description: string;
  priority: number;
  // TODO: create_task - expired_at: Date;
};

type AddTaskProp = {
  handleRefresh: () => void;
  handleModal: (boolean) => void;
};

type AllTaskProp = {
  tasks: TaskType[];
  handleRefresh: () => void;
};

// TODO: rename this
// TODO: show task detail Modal
type TaskProp = {
  task: TaskType;
  handleRefresh: () => void;
};
