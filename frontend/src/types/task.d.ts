type TaskType = {
  id: number;
  user_id: number;
  comment: string;
  priority: number;
  created_at: Date;
  updated_at: Date;
  expired_at: Date;
  is_done: boolean;
};

type TaskCreateType = {
  comment: string;
  priority: number;
  // TODO: create_task - expired_at: Date;
};

type AddTaskProp = {
  handleRefresh: () => void;
  handleModal: (boolean) => void;
};
